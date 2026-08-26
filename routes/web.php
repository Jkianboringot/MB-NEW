<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/products', [ProductController::class,'index'])->name('products.index'); // this are use for static site/view
    Route::get('/products/create', [ProductController::class,'create'])->name('products.create'); // this are use for static site/view
    Route::post('/products', [ProductController::class,'store'])->name('products.store'); // this are use for static site/view

});

require __DIR__.'/settings.php';
