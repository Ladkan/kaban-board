# Kanban Board

Fullstack aplikace pro správu úkolů ve stylu Kanban boardu. Postavena na **React**, **Zustand**, **TanStack Form** a **PocketBase**.

---

## Ukázkové přihlašovací údaje

Pro rychlé vyzkoušení aplikace použij jeden z testovacích účtů:

| E-mail | Heslo |
|---|---|
| user@test.com | 1234567890 |
| user2@test.com | 1234567890 |
| user3@test.com | 1234567890 |

> Testovací účty sdílejí společné boardy — můžeš otevřít aplikaci ve dvou oknech a sledovat realtime synchronizaci.

---

## Funkce

- Přihlášení a registrace přes PocketBase Auth
- Vytváření a správa Kanban boardů
- Sloupce s drag & drop přesouváním karet (dnd-kit)
- Realtime synchronizace — změny se okamžitě propagují všem přihlášeným uživatelům
- Přidávání členů k boardu
- Progress bar dokončených úkolů
- Priority na kartách
- Přiřazení úkolu uživateli
- Search úkolu v boardu

---

## Tech Stack

### Frontend

| Technologie | Účel |
|---|---|
| React 18 | UI framework |
| Zustand | Globální state management |
| TanStack Form | Formuláře s validací |
| Zod | Schémata a validace |
| @dnd-kit | Drag & drop |
| Tailwind CSS | Stylování |

### Backend

| Technologie | Účel |
|---|---|
| PocketBase | Backend, databáze, auth, realtime |

---

## Instalace a spuštění

### Požadavky

- Node.js 18+
- npm nebo pnpm

### 1. Klon repozitáře

```bash
git clone https://github.com/uzivatel/kanban-board.git
cd kanban-board
```

### 2. Instalace závislostí

```bash
npm install
```

### 3. Spuštění PocketBase

Stáhni PocketBase z [pocketbase.io](https://pocketbase.io/docs/) a spusť:

```bash
./pocketbase serve
```

PocketBase Admin UI bude dostupné na `http://127.0.0.1:8090/_/`.

### 4. Nastavení PocketBase kolekcí

V Admin UI vytvoř následující kolekce podle schématu níže:

### 5. Proměnné prostředí

Vytvoř soubor `.env` v kořeni projektu:

```env
VITE_PB_URL=http://127.0.0.1:8090
```

### 6. Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173`.

---

## PocketBase schéma

### `users` (vestavěná kolekce)

| Pole | Typ |
|---|---|
| email | Email |
| name | Text |
| avatar | File |

### `boards`

| Pole | Typ | Povinné |
|---|---|---|
| title | Text | ano |
| description | Text | ne |
| owner | Relation → users | ano |
| members | Relation → users (multiple) | ne |

**API Rules:**
```
List/View: @request.auth.id != "" && (owner = @request.auth.id || members ~ @request.auth.id)
Create:    @request.auth.id != "" && owner = @request.auth.id
Update:    @request.auth.id != "" && owner = @request.auth.id
Delete:    @request.auth.id != "" && owner = @request.auth.id
```

### `columns`

| Pole | Typ | Povinné |
|---|---|---|
| title | Text | ano |
| order | Number | ano |
| color | Text | ne |
| board | Relation → boards (cascade delete) | ano |

**API Rules:**
```
List/View: @request.auth.id != "" && (board.owner = @request.auth.id || board.members ~ @request.auth.id)
Create:    @request.auth.id != "" && board.owner = @request.auth.id
Update:    @request.auth.id != "" && board.owner = @request.auth.id
Delete:    @request.auth.id != "" && board.owner = @request.auth.id
```

### `tasks`

| Pole | Typ | Povinné |
|---|---|---|
| title | Text | ano |
| description | Text | ne |
| order | Number | ano |
| priority | Select (low / medium / high) | ne |
| column | Relation → columns (cascade delete) | ano |
| assignee | Relation → users | ne |
| due_date | DateTime | ne |

**API Rules:**
```
List/View: @request.auth.id != "" && ( column.board.owner = @request.auth.id || @collection.board_members.board ?= column.board && @collection.board_members.user ?= @request.auth.id)
Create/Update/Delete: @request.auth.id != "" && ( column.board.owner = @request.auth.id || assignee.id = @request.auth.id || @collection.board_members.board ?= column.board &&  @collection.board_members.user ?= @request.auth.id && @collection.board_members.role ?= "editor" )
```

### `board_members`

| Pole | Typ | Povinné |
|---|---|---|
| board | Relation → boards (cascade delete) | ano
| user | Relation → users (cascade delete) | ano
| role | Select (viewer / editor) | ano

**API Rules:**
```
List/View: @request.auth.id != "" && (board.owner = @request.auth.id || user = @request.auth.id)
Create:    @request.auth.id != "" && board.owner = @request.auth.id
Update:    @request.auth.id != "" && board.owner = @request.auth.id
Delete:    @request.auth.id != "" && board.owner = @request.auth.id
```

---

## Dostupné skripty

```bash
npm run dev        # spustí vývojový server
npm run build      # vytvoří produkční build
npm run preview    # náhled produkčního buildu
npm run lint       # ESLint kontrola
npm run typecheck  # TypeScript kontrola
```

---

![alt text](https://i.postimg.cc/YC0QrtfB/firefox-uvd-LXxh-Ob-Z.png)

## Licence

MIT
