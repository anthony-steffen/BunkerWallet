"""add market_cap and rank to assets

Revision ID: 5475012c9f18
Revises: 3e6321a584b2
Create Date: 2025-09-30 22:33:36.070927

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5475012c9f18"
down_revision: Union[str, Sequence[str], None] = "3e6321a584b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "assets", sa.Column("market_cap", sa.BigInteger(), nullable=True)
    )
    op.add_column("assets", sa.Column("rank", sa.Integer(), nullable=True))


def downgrade():
    op.drop_column("assets", "market_cap")
    op.drop_column("assets", "rank")
