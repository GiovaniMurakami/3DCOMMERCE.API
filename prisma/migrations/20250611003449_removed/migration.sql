/*
  Warnings:

  - The values [PAYMENT_PENDING,PAID,RETURN_REQUESTED,RETURN_APPROVED,RETURNED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `total_price` on the `orders` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('CANCELED', 'WAITING_CONFIRMATION', 'PRINTING', 'SHIPPED', 'DELIVERED');
ALTER TABLE "orders" ALTER COLUMN "current_status" TYPE "OrderStatus_new" USING ("current_status"::text::"OrderStatus_new");
ALTER TABLE "order_status_histories" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "total_price",
ALTER COLUMN "address" DROP NOT NULL;
