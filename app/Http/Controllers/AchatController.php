<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Mail\CommandeConfirmation;
use App\Mail\CadeauMail;
use App\Jobs\EnvoieEmailCadeau;
use Carbon\Carbon;
use Omnipay\Omnipay;
use Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;

class AchatController extends Controller
{
    public function index()
    {
        return view('panier');
    }

    public function achat(Request $request)
    {

        function strip_accents($s){
            return str_replace(
              explode(' ', preg_replace('/ +/', ' ', 'č ć ž š đ  Č Ć Ž Š Đ  à á â ã ä ç è é ê ë ì í î ï ñ ò ó ô õ ö ù ú û ü ý ÿ À Á Â Ã Ä Ç È É Ê Ë Ì Í Î Ï Ñ Ò Ó Ô Õ Ö Ù Ú Û Ü Ý')),
              explode(' ', preg_replace('/ +/', ' ', 'c c z s dj C C Z S DJ a a a a a c e e e e i i i i n o o o o o u u u u y y A A A A A C E E E E I I I I N O O O O O U U U U Y')),
              $s);
        }

        if ($request->stripeToken) {
  
            $gateway = Omnipay::create('Stripe');
            $gateway->setApiKey(env('STRIPE_SECRET_KEY'));
           
            $token = $request->stripeToken;
           
            $response = $gateway->purchase([
                'amount' => 15,
                'currency' => env('STRIPE_CURRENCY'),
                'token' => $token,
            ])->send();
           
            if ($response->isSuccessful()) {
                $arr_payment_data = $response->getData();

                do {
                    $id_commande = mt_rand(1000000000, 9999999999);
                    $id_exist = Commande::where('id_commande', '=', $id_commande)->first();

                } while ($id_exist);

                $commande = Commande::create([
                    'id_commande' => $id_commande,
                    'evenement' => $request->evenement,
                    'choix_personnage' => $request->choix_personnage,
                    'nom_personnage' => strip_accents($request->nom_personnage),
                    'choix_personnage_secondaire' => $request->choix_personnage_secondaire,
                    'nom_personnage_secondaire' => $request->nom_personnage_secondaire,
                    'choix_ennemi' => $request->choix_ennemi,
                    'nom_ennemi' => $request->nom_ennemi,
                    'message_introduction' => $request->message_introduction,
                    'message_fin' => $request->message_fin,
                    'cadeau_1' => $request->cadeau_1,
                    'cadeau_2' => $request->cadeau_2,
                    'cadeau_3' => $request->cadeau_3,
                    'cadeau_4' => $request->cadeau_4,
                    // 'date_cadeau' => $request->date_cadeau,
                    // 'email_cadeau' => $request->email_cadeau,
                    'payeur_nom' => $request->payeur_nom,
                    'payeur_prenom' => $request->payeur_prenom,
                    'payeur_email' => $request->payeur_email,
                    'payeur_telephone' => $request->payeur_telephone,
                    'methode_paiement' => $request->methode_paiement,
                    'statut_paiement' => 'Payé',
                    'prix_total' => '15'
                ]);
            
                $commande->save();

                // $commande->date_cadeau = Carbon::parse($commande->date_cadeau)->format('d-m-Y');
                // $date_cadeau = new Carbon($commande->date_cadeau);

                Mail::to($request->payeur_email)->send(new CommandeConfirmation($commande));
                // try {

                //     // $job = (new EnvoieEmailCadeau($commande))->delay($date_cadeau);

                //     // dispatch($job);

                // } catch(\Swift_TransportException $e){
                //     if($e->getMessage()) {
                //         dd($e->getMessage());
                //     }             
                // }
  
                return response()->json([
                    'message' => 'Paiement réussi'
                ]);
            } else {
                // payment failed: display message to customer
                return $response->getMessage();
            }
        }      
    }

    public function achatPaypal(Request $request)
    {
        do {
            $id_commande = mt_rand(1000000000, 9999999999);
            $id_exist = Commande::where('id_commande', '=', $id_commande)->first();

        } while ($id_exist);

        $commande = [
            'id_commande' => $id_commande,
            'evenement' => $request->evenement,
            'choix_personnage' => $request->choix_personnage,
            'nom_personnage' => string_accent($request->nom_personnage),
            'choix_personnage_secondaire' => $request->choix_personnage_secondaire,
            'nom_personnage_secondaire' => $request->nom_personnage_secondaire,
            'choix_ennemi' => $request->choix_ennemi,
            'nom_ennemi' => $request->nom_ennemi,
            'message_introduction' => $request->message_introduction,
            'message_fin' => $request->message_fin,
            'cadeau_1' => $request->cadeau_1,
            'cadeau_2' => $request->cadeau_2,
            'cadeau_3' => $request->cadeau_3,
            'cadeau_4' => $request->cadeau_4,
            // 'date_cadeau' => $request->date_cadeau,
            // 'email_cadeau' => $request->email_cadeau,
            'payeur_nom' => $request->payeur_nom,
            'payeur_prenom' => $request->payeur_prenom,
            'payeur_email' => $request->payeur_email,
            'payeur_telephone' => $request->payeur_telephone,
            'methode_paiement' => $request->methode_paiement,
            'statut_paiement' => 'Payé',
            'prix_total' => '15'
        ];

        Session::put('commande', $commande);
        Session::put('info_commande', 'Session sauvé');
        Session::save();
    }

    public function achatPaypalValide(Request $request)
    {
        
        $info_commande = session('commande', 'default');

        $commande = Commande::create([
            'id_commande' => $info_commande['id_commande'],
            'evenement' => $info_commande['evenement'],
            'choix_personnage' => $info_commande['choix_personnage'],
            'nom_personnage' => $info_commande['nom_personnage'],
            'choix_personnage_secondaire' => $info_commande['choix_personnage_secondaire'],
            'nom_personnage_secondaire' => $info_commande['nom_personnage_secondaire'],
            'choix_ennemi' => 'choix_ennemi',
            'nom_ennemi' => $info_commande['nom_ennemi'],
            'message_introduction' => $info_commande['message_introduction'],
            'message_fin' => $info_commande['message_fin'],
            'cadeau_1' => $info_commande['cadeau_1'],
            'cadeau_2' => $info_commande['cadeau_2'],
            'cadeau_3' => $info_commande['cadeau_3'],
            'cadeau_4' => $info_commande['cadeau_4'],
            // 'date_cadeau' => $info_commande['date_cadeau'],
            // 'email_cadeau' => $info_commande['email_cadeau'],
            'payeur_nom' => $info_commande['payeur_nom'],
            'payeur_prenom' => $info_commande['payeur_prenom'],
            'payeur_email' => $info_commande['payeur_email'],
            'payeur_telephone' => $info_commande['payeur_telephone'],
            'methode_paiement' => $info_commande['methode_paiement'],
            'statut_paiement' => 'Payé',
            'prix_total' => '15'
        ]);

        $commande->save();
        
        // $commande->date_cadeau = Carbon::parse($commande->date_cadeau)->format('d-m-Y');
        // $date_cadeau = new Carbon($commande->date_cadeau);
        
        Mail::to($commande->email_cadeau)->send(new CommandeConfirmation($commande));
        
        // $job = (new EnvoieEmailCadeau($commande))->delay($date_cadeau);
        
        // dispatch($job);
        
        Session::forget('commande');
    }
}
