<?php

namespace App\Http\Controllers;
use App\Models\Commande;

use Illuminate\Http\Request;

class APIController extends Controller
{
    public function commande($id)
    {
        $commande = Commande::where('id_commande', '=', $id)->first();

        if ($commande) {
            return response()->json([$commande]);
        } 
        else {
            return response()->json([
                'message' => 'Aucune commande trouvée pour cette ID'
            ]);
        }
    }
}
