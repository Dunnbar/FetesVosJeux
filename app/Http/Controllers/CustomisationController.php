<?php

namespace App\Http\Controllers;

use App\Models\PackCadeau;
use Illuminate\Http\Request;

class CustomisationController extends Controller
{
    public function index($pack)
    {
        $pack = PackCadeau::where('nom_pack', '=', $pack)->first();
        return view('pack', compact('pack'));
    }
}
