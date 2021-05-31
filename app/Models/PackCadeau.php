<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Auth;

class PackCadeau extends Model
{

    protected $table = "packs_cadeau";
    protected $primaryKey = "id";

    protected $fillable = [
        'nom_pack',
        'description_pack',
        'evenement',
        'message_introduction',
        'message_fin',
        'image_url',
        'prix'
    ];
}