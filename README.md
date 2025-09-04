# Sistema Contable — Django + React

Proyecto base listo para cumplir con el TP Integrador N°1 (Sistema Contable).
Backend en Django REST + JWT. Frontend en React (Vite).

## Requisitos de la cátedra cubiertos
- **Login** con usuario y contraseña (JWT) ✔
- **Roles**: admin (is_staff) y usuario (flexible para crecer) ✔
- **Plan de cuentas** (árbol) con alta/baja/modificación solo admin ✔
- **Registro de asientos** con partida doble (debe = haber) ✔
- **Libro Diario** entre fechas ✔
- **Libro Mayor** por cuenta y fechas ✔
- (Plus) Auditoría: `created_by` en asientos ✔
- (Opcional) Exportar a PDF: se puede agregar fácil con xhtml2pdf/WeasyPrint

## Cómo correrlo

### 1) Backend
```bash
cd backend
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Migraciones + superusuario
python manage.py migrate
python manage.py createsuperuser  # usuario admin

# (Opcional) cargar algunas cuentas de ejemplo en admin
python manage.py runserver 0.0.0.0:8000
```

Endpoints principales:
- `POST /api/token/` (login JWT)
- `GET /api/accounts/` CRUD (solo admin para escribir)
- `GET /api/accounts/tree` (árbol)
- `POST/GET /api/journal-entries/`
- `GET /api/reports/diario?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`
- `GET /api/reports/mayor?cuenta_id=ID&desde=YYYY-MM-DD&hasta=YYYY-MM-DD`

### 2) Frontend
```bash
cd frontend
npm i
npm run dev
```
Abrir `http://localhost:5173`. Iniciar sesión con el usuario creado.

## Notas
- Para roles, se usa `is_staff` como admin. También podés manejar *Groups* en /admin.
- La eliminación de cuentas usadas en asientos está bloqueada (signal).
- La partida doble se valida: suma(D) = suma(H).
- Base de datos por defecto: SQLite (fácil para TP).

## Próximos pasos (sugeridos)
- Seed inicial de plan de cuentas.
- Exportar PDF de Diario/Mayor desde backend.
- Logs/Auditoría más detallada.
- Tests de API (DRF) y CI.