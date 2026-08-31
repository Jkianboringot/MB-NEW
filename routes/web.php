<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', 'dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('products')->group(
        function () {
            Route::get('/', [ProductController::class, 'index'])->name('products.index');
            Route::get('/create', [ProductController::class, 'create'])->name('products.create');
            Route::post('/', [ProductController::class, 'store'])->name('products.store');
            Route::get('/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');

            Route::delete('/{id}', [ProductController::class, 'delete'])->name('products.delete');
            Route::put('/{id}', [ProductController::class, 'update'])->name('products.update');
        }
    );

    Route::prefix('inventories')->name('inventories.')->group(
        function () {
            Route::get('/', [InventoryController::class, 'index'])
                ->name('index');

            Route::get('/create-in', [InventoryController::class, 'createIn'])
                ->name('create-in');
            Route::post('/in', [InventoryController::class, 'storeIn'])
                ->name('store-in');

            Route::get('/create-out', [InventoryController::class, 'createOut'])
                ->name('create-out');
            Route::post('/out', [InventoryController::class, 'storeOut'])
                ->name('store-out');
        }
    );

});

require __DIR__ . '/settings.php';
