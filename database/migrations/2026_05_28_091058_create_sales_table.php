<?php

use App\Enums\Shift;
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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained(); // already index, we only create another index if
            // we are doing a where with branch shift for example, if we are doing that alot, not speculation

            // TODO - added the relation
            $table->foreignId('inventory_id')->constrained(); // 1:1 with inventory, not done yet

            $table->string('shift', 40)->default(Shift::Opening->value);
            $table->decimal('cash_amount', 8, 2)->unsigned()->nullable();
            $table->decimal('gcash_amount', 8, 2)->unsigned()->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
