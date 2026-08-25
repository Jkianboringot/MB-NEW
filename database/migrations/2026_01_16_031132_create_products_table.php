<?php

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
        // REMOVE
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name',75);
            $table->decimal('price')->unsigned()->default(0);
            $table->index('name','products_name_index');
            // btw this is not good practice am only doing it becuase am a solo dev , but never ever do this on production
            //this is development
            $table->timestamps();


            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
