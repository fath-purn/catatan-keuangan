-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT '👦🏻',
ADD COLUMN     "targetGayaHidup" DOUBLE PRECISION NOT NULL DEFAULT 5000000;

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🎯',
    "target" DOUBLE PRECISION NOT NULL,
    "terkumpul" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tenggatWaktu" TIMESTAMP(3) NOT NULL,
    "warnaBackground" TEXT NOT NULL DEFAULT '#DBCBFF',
    "motivasi" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "judul" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "aset" TEXT NOT NULL,
    "mood" TEXT NOT NULL DEFAULT 'Biasa',
    "keperluan" TEXT NOT NULL,
    "jenis_transaksi" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
