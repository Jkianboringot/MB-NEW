<?php

use App\Enums\InOutType;
use App\Enums\InventoryType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20)->default(InOutType::In->value);
            // TODO - ondelete
            $table->foreignId('encoder_id')->constrained('users');
            $table->foreignId('stock_movement_id')->constrained('stock_movements');
            $table->string('inventory_type', 40)->default(InventoryType::Transfer->value);
            $table->index('stock_movement_id');
            // even if its small its e3Dssential for faster query and filter go ingredient table and read example

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
