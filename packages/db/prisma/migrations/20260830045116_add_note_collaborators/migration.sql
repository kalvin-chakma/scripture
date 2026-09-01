-- CreateTable
CREATE TABLE "note_collaborators" (
    "id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_collaborators_user_id_idx" ON "note_collaborators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "note_collaborators_note_id_user_id_key" ON "note_collaborators"("note_id", "user_id");

-- AddForeignKey
ALTER TABLE "note_collaborators" ADD CONSTRAINT "note_collaborators_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_collaborators" ADD CONSTRAINT "note_collaborators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
