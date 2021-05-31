<?php

namespace App\Http\Controllers;

use App\Models\PackCadeau;
use Illuminate\Http\Request;

class AccueilController extends Controller
{
    public function index()
    {
        $packs = PackCadeau::get();

        return view('accueil', compact('packs'));
    }
}
