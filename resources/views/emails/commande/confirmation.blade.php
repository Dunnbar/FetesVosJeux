@component('mail::message')
# Merci pour votre achat {{ $commande['payeur_prenom'] }} ! 

Un lien de téléchargement pour votre jeu personnalisé sera envoyé à {{ $commande['email_cadeau'] }} le {{ $commande['date_cadeau'] }} !


<!-- 
@component('mail::button', ['url' => ''])
Button Text
@endcomponent -->


{{ config('app.name') }}
@endcomponent
