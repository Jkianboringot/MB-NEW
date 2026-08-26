<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{

    public function create(){
        return Inertia::render('Products/Create',[]);
    }

     public function store(Request $request){
        dd($request??'askldjflasdf');
        // return 'fuck';
    }
    public function index(){
        return Inertia::render('Products/Index',[]);
    }
}
