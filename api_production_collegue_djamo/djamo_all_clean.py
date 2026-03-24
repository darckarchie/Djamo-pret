#!/usr/bin/env python3
import base64
import json
import os
import sys
import time
from datetime import date, timedelta

import requests

ACCOUNTS_FILE = os.path.join(os.path.dirname(__file__), "accounts.json")

AUTH = "https://authv2-production-civ.djamo.io"
API = "https://apiv2-production-civ.djamo.io"

HEADERS = {
    "content-type": "application/json",
    "x-app": "mobile",
    "x-app-version": "900.76.3",
    "x-app-env": "production",
    "x-os": "android",
    "x-app-build-number": "1777",
    "user-agent": "djamoapp-v3",
    "auth-version": "2",
}

session = requests.Session()
TOKEN = None
CURRENT_ACCOUNT = {}
CURRENT_ACCOUNT_ID = None


def sep(title=""):
    print(f"\n{'=' * 60}")
    if title:
        print(f"  {title}")
        print(f"{'=' * 60}")


def log(label, value=""):
    print(f"  {label:<30} {value}")


def load_accounts():
    if not os.path.exists(ACCOUNTS_FILE):
        default = {
            "comptes": [],
            "actif": 0
        }
        save_accounts(default)
        return default

    with open(ACCOUNTS_FILE, encoding="utf-8") as file:
        data = json.load(file)

    data.setdefault("comptes", [])
    data.setdefault("actif", 0)
    return data


def save_accounts(data):
    with open(ACCOUNTS_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def pick_account(data):
    global CURRENT_ACCOUNT, CURRENT_ACCOUNT_ID

    comptes = data.get("comptes", [])
    if not comptes:
        print("[!] Aucun compte configure. Ajoutez-en un avec --accounts.")
        sys.exit(1)

    actif = data.get("actif", 0)
    actif = min(max(actif, 0), len(comptes) - 1)

    sep("COMPTES SAUVEGARDES")
    for i, compte in enumerate(comptes):
        marker = " [ACTIF]" if i == actif else ""
        print(f"  [{i}] {compte['name']}  {compte['phone']}{marker}")
    print("  [n] Ajouter un nouveau compte")
    print()

    choix = input(f"  Compte a utiliser [{actif}] : ").strip()

    if choix == "n":
        compte = add_account(data)
        actif = len(data["comptes"]) - 1
    elif choix == "":
        compte = comptes[actif]
    else:
        try:
            actif = int(choix)
            compte = comptes[actif]
        except (ValueError, IndexError):
            print("[-] Choix invalide, compte actif utilise")
            compte = comptes[actif]

    data["actif"] = actif
    save_accounts(data)
    CURRENT_ACCOUNT = compte
    CURRENT_ACCOUNT_ID = compte.get("account_id")
    print(f"\n[+] Compte actif : {compte['name']}  {compte['phone']}")
    return compte


def add_account(data):
    sep("AJOUTER UN COMPTE")
    name = input("  Nom : ").strip()
    phone = input("  Telephone E164 (+225...) : ").strip()
    phone_id = input("  phoneNumberId (UUID) : ").strip()
    device_id = input("  deviceUniqueIdentifier : ").strip()
    pin = input("  PIN (4-6 chiffres) : ").strip()
    account_id = input("  accountId FINERACT_CURRENT (laisser vide = auto) : ").strip()

    compte = {
        "name": name,
        "phone": phone,
        "phone_id": phone_id,
        "device_id": device_id,
        "pin": pin,
        "account_id": account_id,
    }
    data.setdefault("comptes", []).append(compte)
    save_accounts(data)
    print(f"[+] Compte '{name}' sauvegarde")
    return compte


def auth_headers():
    if not TOKEN:
        return dict(HEADERS)
    return {**HEADERS, "Authorization": f"Bearer {TOKEN}"}


def post_auth(path, payload):
    return session.post(
        f"{AUTH}{path}",
        json=payload,
        headers=HEADERS,
        timeout=15,
    )


def get_api(path, params=None):
    return session.get(
        f"{API}{path}",
        params=params,
        headers=auth_headers(),
        timeout=15,
    )


def post_api(path, payload):
    return session.post(
        f"{API}{path}",
        json=payload,
        headers=auth_headers(),
        timeout=15,
    )


def token_valid():
    if not TOKEN:
        return False

    try:
        payload = TOKEN.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        decoded = json.loads(base64.b64decode(payload))
        return time.time() < decoded["exp"] - 30
    except Exception:
        return False


def login():
    global TOKEN

    response = post_auth(
        "/v2/login/client",
        {
            "deviceUniqueIdentifier": CURRENT_ACCOUNT["device_id"],
            "phoneNumberId": CURRENT_ACCOUNT["phone_id"],
            "passcode": CURRENT_ACCOUNT["pin"],
        },
    )

    try:
        data = response.json()
    except ValueError:
        print(f"[-] Reponse invalide: {response.status_code}")
        return False

    if response.status_code != 200 or "accessToken" not in data:
        print(f"[-] Login failed: {response.status_code} {response.text[:200]}")
        return False

    if data.get("scope") == "challenge-only":
        print("[-] Validation supplementaire requise. Relancez avec --otp.")
        return False

    TOKEN = data["accessToken"]

    try:
        payload = TOKEN.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        decoded = json.loads(base64.b64decode(payload))
        remaining = int(decoded["exp"] - time.time())
        print(f"[+] Login OK ({remaining}s restants)")
    except Exception:
        print("[+] Login OK")

    return True


def do_otp():
    response = post_auth(
        "/v2/challenges",
        {
            "type": "sms",
            "phoneNumberId": CURRENT_ACCOUNT["phone_id"],
            "deviceUniqueIdentifier": CURRENT_ACCOUNT["device_id"],
        },
    )

    try:
        challenge = response.json()
    except ValueError:
        print(f"[-] OTP init failed: {response.status_code}")
        return False

    if "id" not in challenge:
        print(f"[-] OTP init failed: {response.status_code} {response.text[:200]}")
        return False

    print(f"[+] SMS envoye sur {CURRENT_ACCOUNT['phone']}")
    code = input("[?] Code OTP : ").strip()

    validation = post_auth(
        f"/v2/challenges/{challenge['id']}",
        {
            "id": challenge["id"],
            "value": code,
            "deviceUniqueIdentifier": CURRENT_ACCOUNT["device_id"],
        },
    )

    if validation.status_code not in (200, 201, 204):
        print(f"[-] OTP failed: {validation.status_code}")
        return False

    print("[+] Appareil verifie")
    return True


def resolve_account_id():
    global CURRENT_ACCOUNT_ID

    if CURRENT_ACCOUNT_ID:
        return CURRENT_ACCOUNT_ID

    response = get_api("/v2/accounts")
    response.raise_for_status()

    current = next(
        (account for account in response.json() if account.get("type") == "FINERACT_CURRENT"),
        None,
    )

    if current:
        CURRENT_ACCOUNT_ID = current["id"]
        data = load_accounts()
        if data.get("comptes"):
            data["comptes"][data.get("actif", 0)]["account_id"] = CURRENT_ACCOUNT_ID
            save_accounts(data)
        print(f"[+] accountId resolu : {CURRENT_ACCOUNT_ID}")

    return CURRENT_ACCOUNT_ID


def section_comptes():
    sep("COMPTES ET SOLDES")
    response = get_api("/v2/accounts")
    response.raise_for_status()

    for account in response.json():
        log(
            account.get("type", "?"),
            f"balance={account.get('balance', '?')} FCFA  id={account.get('id', '')}  extId={account.get('externalId', '')}",
        )


def section_transactions():
    sep("HISTORIQUE TRANSACTIONS (30j)")
    today = date.today().isoformat()
    start = (date.today() - timedelta(days=30)).isoformat()

    response = get_api(
        "/v2/transactions/list",
        params={"startDate": start, "endDate": today},
    )
    response.raise_for_status()

    raw = response.json()
    transactions = raw.get("data", raw) if isinstance(raw, dict) else raw
    total = raw.get("count", len(transactions)) if isinstance(raw, dict) else len(transactions)

    print(f"  {total} transaction(s)\n")
    print(f"  {'Date':<21} {'Type':<7} {'Montant':<12} {'Status':<11} {'ID'}")
    print(f"  {'-' * 21} {'-' * 7} {'-' * 12} {'-' * 11} {'-' * 36}")

    for transaction in transactions:
        transaction_date = transaction.get("date", "")[:19].replace("T", " ")
        transaction_type = transaction.get("type", "?")
        charged_amount = transaction.get("chargedAmount", 0)
        status = transaction.get("status", "?")
        transaction_id = transaction.get("id", "?")
        sign = "-" if transaction_type == "debit" else "+"
        print(
            f"  {transaction_date:<21} {transaction_type:<7} "
            f"{sign}{charged_amount:<12} {status:<11} {transaction_id}"
        )


def section_services():
    sep("SERVICES ET FEATURE FLAGS")
    services_response = get_api("/v2/services")
    services_response.raise_for_status()
    services = services_response.json()

    print(f"  {len(services)} service(s) :\n")
    print(f"  {'category':<20} {'identifier':<35} {'name'}")
    print(f"  {'-' * 20} {'-' * 35} {'-' * 25}")

    for service in services:
        print(
            f"  {service.get('category', ''):<20} "
            f"{service.get('identifier', service.get('serviceIdentifier', '')):<35} "
            f"{service.get('name', '')}"
        )

    features_response = get_api("/v2/features")
    features_response.raise_for_status()
    features = features_response.json()

    print("\n  Feature flags :")
    if isinstance(features, list):
        for feature in features:
            if isinstance(feature, dict):
                print(
                    f"    {feature.get('name', feature.get('key', '?')):<40} "
                    f"= {feature.get('value', feature.get('enabled', '?'))}"
                )
            else:
                print(f"    {feature}")
    elif isinstance(features, dict):
        for key, value in features.items():
            print(f"    {key:<40} = {value}")


def print_help():
    print(
        """
Usage : python djamo_all_clean.py [sections] [options]

Sections :
  --all              Executer toutes les sections disponibles
  --login            Connexion
  --comptes          Soldes et comptes
  --transactions     Historique 30 jours
  --services         Services + feature flags
  --accounts         Gerer les comptes sauvegardes

Options :
  --otp              Verifier l'appareil par SMS
  --compte N         Utiliser le compte N directement (sans menu)

Fichier comptes : accounts.json (meme dossier)

Exemples :
  python djamo_all_clean.py --all
  python djamo_all_clean.py --login --comptes --transactions
  python djamo_all_clean.py --services
  python djamo_all_clean.py --accounts
"""
    )


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args or "--help" in args or "-h" in args:
        print_help()
        sys.exit(0)

    database = load_accounts()

    if "--accounts" in args:
        add_only = len(database.get("comptes", [])) == 0
        if add_only:
            add_account(database)
        else:
            pick_account(database)
        sys.exit(0)

    if "--compte" in args:
        idx = args.index("--compte")
        database["actif"] = int(args[idx + 1])
        save_accounts(database)

    comptes = database.get("comptes", [])
    if not comptes:
        print("[!] Aucun compte configure. Lancez d'abord : python djamo_all_clean.py --accounts")
        sys.exit(1)

    if len(comptes) > 1 and "--compte" not in args:
        pick_account(database)
    else:
        compte = comptes[database.get("actif", 0)]
        CURRENT_ACCOUNT.update(compte)
        CURRENT_ACCOUNT_ID = compte.get("account_id")
        print(f"[*] Compte actif : {compte['name']}  {compte['phone']}")

    if "--otp" in args:
        if not do_otp():
            sys.exit(1)

    if not login():
        sys.exit(1)

    run_all = "--all" in args

    if run_all or "--comptes" in args:
        section_comptes()

    if run_all or "--transactions" in args:
        section_transactions()

    if run_all or "--services" in args:
        section_services()

    sep("DONE")
