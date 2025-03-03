/*
  Warnings:

  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_product_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OrderItem";

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "product_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
