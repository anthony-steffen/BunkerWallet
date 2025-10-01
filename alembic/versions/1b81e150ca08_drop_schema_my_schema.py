"""drop schema my_schema

Revision ID: 1b81e150ca08
Revises:
Create Date: 2025-09-30 16:17:30.487139

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "1b81e150ca08"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Dropar o schema (com `CASCADE` remove todos os objetos dentro dele)
    op.execute("DROP SCHEMA IF EXISTS my_schema CASCADE;")


def downgrade() -> None:
    # Recriar o schema
    op.execute("CREATE SCHEMA my_schema;")
