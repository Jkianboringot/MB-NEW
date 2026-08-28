<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', 'dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/products', [ProductController::class,'index'])->name('products.index'); 
    Route::get('/products/create', [ProductController::class,'create'])->name('products.create'); 
    Route::post('/products', [ProductController::class,'store'])->name('products.store'); 
    Route::get('/products/{id}/edit', [ProductController::class,'edit'])->name('products.edit'); 

    Route::delete('/products/{id}', [ProductController::class,'delete'])->name('products.delete'); 
    Route::put('/products/{id}', [ProductController::class,'update'])->name('products.update'); 

});

require __DIR__.'/settings.php';
