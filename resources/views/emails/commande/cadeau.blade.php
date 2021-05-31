@component('mail::message')
# {{ $commande['payeur_prenom'] }} {{ $commande['payeur_nom'] }} vous a envoyé un cadeau!

Téléchargez l'application Fêtes Vos Jeux Vidéos en cliquant sur le lien ci-dessous et entrez le code <strong>{{ $commande['id_commande'] }}</strong> pour découvrir votre surprise!

@component('mail::button', ['url' => ''])
// lien de l'application
@endcomponent

{{ config('app.name') }}
@endcomponent
