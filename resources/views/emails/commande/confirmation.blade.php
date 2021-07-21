@component('mail::message')
# Merci pour votre achat {{ $commande['payeur_prenom'] }} ! 

Voici le lien de téléchargement pour le jeu personnalisé ainsi que le code cadeau à rentrer.

Lien de l'application : 
<br>
Code cadeau : <strong>{{ $commande['id_commande'] }}</strong>

<!-- 
@component('mail::button', ['url' => ''])
Button Text
@endcomponent -->


{{ config('app.name') }}
@endcomponent
