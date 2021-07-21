<?php

namespace App\Http\Controllers;
use App\Models\Commande;

use Illuminate\Http\Request;

class APIController extends Controller
{
    public function commande($id_commande)
    {
        $commande = Commande::where('id_commande', '=', $id_commande)->first();

        if ($commande) {
            // ajouter derniere connection + nb de connections
            return response()->json($commande);
        } 
        else {
            abort(404);
        }
    }
}
