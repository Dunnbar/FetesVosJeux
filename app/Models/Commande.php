<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Auth;

class Commande extends Model
{

    protected $table = "commandes";
    protected $primaryKey = "id";

    protected $fillable = [
        'id_commande',
        'evenement',
        'choix_personnage',
        'nom_personnage',
        'choix_personnage_secondaire',
        'nom_personnage_secondaire',
        'choix_ennemi',
        'nom_ennemi',
        'message_introduction',
        'message_fin',
        'cadeau_1',
        'cadeau_2',
        'cadeau_3',
        'cadeau_4',
        'date_cadeau',
        'email_cadeau',
        'payeur_nom',
        'payeur_prenom',
        'payeur_email',
        'payeur_telephone',
        'methode_paiement',
        'statut_paiement',
        'prix_total'
    ];
}