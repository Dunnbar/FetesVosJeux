@extends('layout')

@section('page')
    <div class="container youplay-content mt-0">
        <div class="col-md-8 pr-50">
            <!-- <h2>Personne concernée</h2>
            <div class="row">
                <div class="col-md-6">
                    <p>Email pour le cadeau :</p>
                    <div class="youplay-input">
                        <input id="email-cadeau" type="text" name="billing_phone" placeholder="Email de la personne reçevant le cadeau">
                    </div>
                    <p id="erreur-email-cadeau" class="erreur-msg">Ce champ ne peut pas être vide</p>
                </div>
                <div class="col-md-6">
                    <p>Date du cadeau</p>
                    <div class="youplay-input">
                        <input id="date-cadeau" type="date" name="billing_phone" placeholder="Date">
                    </div>
                    <p id="erreur-date-cadeau" class="erreur-msg">Veuillez entrer une date correcte</p>
                </div>
            </div> -->

            <h2>Informations de paiement</h2>
            <div class="row">
                <div class="col-md-6">
                    <p>Prénom :</p>
                    <div class="youplay-input">
                        <input id="prenom" type="text" name="billing_lastname" placeholder="Prénom">
                    </div>
                    <p id="erreur-prenom" class="erreur-msg">Ce champ ne peut pas être vide</p>
                </div>
                <div class="col-md-6">
                    <p>Nom :</p>
                    <div class="youplay-input">
                        <input id="nom" type="text" name="billing_firstname" placeholder="Nom">
                    </div>
                    <p id="erreur-nom" class="erreur-msg">Ce champ ne peut pas être vide</p>
                </div>
            </div>
            <!-- <p>Adresse :</p>
            <div class="row">
                <div class="col-md-6">
                    <div class="youplay-input">
                        <input type="text" name="billing_street" placeholder="6 Rue ...">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="youplay-input">
                        <input type="text" name="billing_apartment" placeholder="Appartement, suite, ...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <p>Ville :</p>
                    <div class="youplay-input">
                        <input type="text" name="billing_city" placeholder="Ville">
                    </div>
                </div>
                <div class="col-md-4">
                    <p>Pays :</p>
                    <div class="youplay-input">
                        <input type="text" name="billing_country" placeholder="Pays">
                    </div>
                </div>
                <div class="col-md-4">
                    <p>Code postal :</p>
                    <div class="youplay-input">
                        <input type="text" name="billing_postcode" placeholder="Code postal">
                    </div>
                </div>
            </div> -->
            <div class="row">
                <div class="col-md-6">
                    <p>Email :</p>
                    <div class="youplay-input">
                        <input id="email" type="email" name="billing_email" placeholder="Email">
                    </div>
                    <p id="erreur-email" class="erreur-msg">Ce champ ne peut pas être vide</p>
                </div>
                <div class="col-md-6">
                    <p>Téléphone :</p>
                    <div class="youplay-input">
                        <input id="telephone" type="phone" name="billing_phone" placeholder="Téléphone">
                    </div>
                </div>
                <p id="erreur-telephone" class="erreur-msg">Ce champ ne peut pas être vide</p>
            </div>

            <h2>Paiement</h2>
            <form id="paiement-form">
                <div class="youplay-radio">
                    <input type="radio" name="methode_paiement" value="paypal" id="paypal-radio" checked>
                    <label for="paypal-radio">PayPal</label>
                </div>
                <div class="youplay-radio">
                    <input type="radio" name="methode_paiement" value="stripe" id="stripe-radio">
                    <label for="stripe-radio">Carte bancaire</label>
                </div>
                <div class="collapse desc" id="champ-carte-bancaire" style="display: none;">
                    <div class="row">
                        <div id="card-element">
                            <!-- A Stripe Element -->
                        </div>
                        <div id="card-errors" role="alert"></div>
                    </div>
                    <div class="align-right">
                        <a href="#" id="btn-commander-stripe" class="btn btn-lg btn-atc">Commander</a>
                    </div> 
                </div>
            </form>  
            <div id="champ-paypal" class="desc">
                @if ($message = Session::get('success'))
                    <?php Session::forget('success');?>
                @endif
                @if ($message = Session::get('error'))
                    <?php Session::forget('error');?>
                @endif
                @if (Session::get('info_commande'))
                    <div id="paypal-succes" style="display: none;">succes</div>
                @endif
            
                <form class="form-horizontal" onSubmit="return valideChampsPanier()" method="POST" id="paypal-form" role="form" action="{!! URL::route('paypal') !!}" >
                    {{ csrf_field() }}
                    <div class="align-right">
                        <button id="btn-commander-paypal" type="submit" class="btn btn-lg btn-atc">
                            Commander
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="col-md-4">
            <div class="side-block">
                <h2>Votre panier</h2>
                <div class="panel-group panier-plein" id="accordion" role="tablist" aria-multiselectable="true">
                    <div class="panel panel-default">
                        <div class="panel-heading" role="tab" id="headingOne">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" class=""> Récapitulatif <span class="icon-minus"></span>
                                </a>
                            </h4>
                        </div>
                        <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne" aria-expanded="true" style="">
                            <div id="panier-contenu" class="panel-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <p><strong>Évènement : </strong><span id="evenement-panier"></span></p>
                                    </div>
                                    <div class="col-md-12">
                                        <p><strong>Nom du personnage principal : </strong><span id="nom-personnage-panier"></span></p>
                                    </div>
                                    <div class="col-md-12">
                                        <p><strong>Personnage principal : </strong>
                                            <img src="" id="personnage-img-panier" alt="personnage principal" width="100px">
                                        </p>
                                    </div>
                                    <div class="col-md-12">
                                        <p><strong>Ennemi : </strong>
                                            <img src="" id="ennemi-img-panier" alt="ennemi" width="100px">
                                        </p>
                                    </div>
                                    <div class="col-md-12">
                                        <p><strong>Message d'introduction : </strong><span id="message-introduction-panier"></span></p>
                                    </div>
                                    <div id="cadeau-1-ligne" class="col-md-12 cadeau-ligne">
                                        <p><strong>Cadeau 1 : </strong><span id="cadeau-1-panier"></span></p>
                                    </div>
                                    <div id="cadeau-2-ligne" class="col-md-12 cadeau-ligne">
                                        <p><strong>Cadeau 2 : </strong><span id="cadeau-2-panier"></span></p>
                                    </div>
                                    <div id="cadeau-3-ligne" class="col-md-12 cadeau-ligne">
                                        <p><strong>Cadeau 3 : </strong><span id="cadeau-3-panier"></span></p>
                                    </div>
                                    <div id="cadeau-4-ligne" class="col-md-12 cadeau-ligne">
                                        <p><strong>Cadeau 4 : </strong><span id="cadeau-4-panier"></span></p>
                                    </div>
                                    <div class="col-md-12">
                                        <p><strong>Message de fin : </strong><span id="message-fin-panier"></span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panier-plein align-right h3 mr-20 mb-20">
                        Total: <strong>$15</strong>
                        <p id="vider-panier">Vider mon panier</p>
                    </div> 
                </div>
                <div class="panier-vide">
                    <div class="item angled-bg">
                        <div class="panier-vide row">
                            <div class="col-xs-6 col-md-9">
                                <h4 class="ml-20">Votre panier est vide. </h4>
                            </div>
                        </div>
                    </div>
                    <h4><a href="/" role="button" aria-expanded="false">Ajouter un cadeau</a></h4>
                </div>
            </div>                
        </div>

        <div id ="modale-succes-paiement" class="modal fade" role="dialog">
            <div class="modal-dialog modal-cadeau">
                <div class="modal-content">
                    <div  id="modale-succes-paiement-header" class="modal-header" >
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 id="paiement-reussi" class="modal-title">Paiement réussi !</h4>
                    </div>
                    <div class="modal-body">
                        Un email de confirmation de commande vient de vous être envoyé.
                    </div>
                </div>
            </div>   
        </div>
        <div id ="modale-error-paiement" class="modal fade" role="dialog">
            <div class="modal-dialog modal-cadeau">
                <div class="modal-content">
                    <div  id="modale-error-paiement-header" class="modal-header" >
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 id="paiement-echoue" class="modal-title">Problème rencontré</h4>
                    </div>
                    <div class="modal-body">
                        Une erreur est survenue. Merci de réessayer ultérieurement.
                    </div>
                </div>
            </div>   
        </div>
    </div>
@stop

@section('custom_scripts')
    <script>
        // Initialise le formulaire de paiement Stripe
        var publishable_key = '{{ env('STRIPE_PUBLISHABLE_KEY') }}';
        var stripe = Stripe(publishable_key);
        var elements = stripe.elements();

        var style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        var card = elements.create('card', {style: style});
        card.mount('#card-element');

        
        $(document).ready(function(){
            // Panier
            if (localStorage.getItem('panier') !== null) {
                $('.panier-vide').hide();
                $('.cadeau-ligne').hide();
                $('.panier-plein').show();

                // Récupère le panier dans le localStorage et affiche les données
                let panier = JSON.parse(localStorage.getItem('panier'))
                $('#evenement-panier').append(panier.evenement);
                $('#message-introduction-panier').append(panier.message_introduction);
                $('#message-fin-panier').append(panier.message_fin);
                $('#nom-personnage-panier').append(panier.nom_personnage);
                $('#personnage-img-panier').prop('src', 'assets/images/fetesvosjeux/personnage/' + panier.choix_personnage + '.png')
                $('#ennemi-img-panier').prop('src', 'assets/images/fetesvosjeux/ennemi/' + panier.choix_ennemi + '.png')

                if (panier.cadeau_1) {
                    $('#cadeau-1-panier').append(panier.cadeau_1);
                    $('#cadeau-1-ligne').show()
                }
                if (panier.cadeau_2) {
                    $('#cadeau-2-panier').append(panier.cadeau_2);
                    $('#cadeau-2-ligne').show()
                }
                if (panier.cadeau_3) {
                    $('#cadeau-3-panier').append(panier.cadeau_3);
                    $('#cadeau-3-ligne').show()
                }
                if (panier.cadeau_4) {
                    $('#cadeau-4-panier').append(panier.cadeau_4);
                    $('#cadeau-4-ligne').show()
                }

            } else {
                $('.panier-plein').hide();
                $('.panier-vide').show();
            }

            // Méthode de paiement
            $('#paypal-radio').click(function(){
                $('#champ-paypal').fadeIn();
                $('#champ-carte-bancaire').hide();
            })

            $('#stripe-radio').click(function(){
                $('#champ-carte-bancaire').fadeIn();
                $('#champ-paypal').hide();
            })

            // Sauvegarde la commande en DB si le paiement Paypal est réussi
            if ($('#paypal-succes').text() === 'succes') {
                $.ajax({
                    type: "POST",
                    url: '/achat/paypalvalide',
                    data: {
                        "_token": "{{ csrf_token() }}",
                        "statut": "succes"
                    },
                    beforeSend: function() {
                        $('#bg-loader').show();
                        $('#loader').show();
                    },
                    success:function(success){  
                        console.log(success);
                    },
                    complete:function(success){
                        $('#bg-loader').hide();
                        $('#loader').hide();
                        if (success.status === 200) {
                            $('#modale-succes-paiement').modal('show');
                        } else {
                            $('#modale-error-paiement').modal('show');
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            }
        })

        // Vide le panier
        $('#vider-panier').click(function(){
            localStorage.clear();
            window.location.href = "/";
        })

        // Vérifie que les champs soient remplis
        function valideChampsPanier() {
            // if ($('#email-cadeau').val().length < 1) {
            //     $('.erreur-msg').hide();
            //     $('#erreur-email-cadeau').show();
            //     return false
            // } 
            // else if (!$('#date-cadeau').val()) {
            //     $('.erreur-msg').hide();
            //     $('#erreur-date-cadeau').show();
            //     return false
            // }
            // else if ($('#date-cadeau').val() < Date.now()) {
            //     $('.erreur-msg').hide();
            //     $('#erreur-date-cadeau').show();
            //     return false
            // }
            if ($('#nom').val().length < 1) {
                $('.erreur-msg').hide();
                $('#erreur-nom').show();
                return false
            }
            else if ($('#prenom').val().length < 1) {
                $('.erreur-msg').hide();
                $('#erreur-prenom').show();
                return false
            }
            else if ($('#email').val().length < 1) {
                $('.erreur-msg').hide();
                $('#erreur-email').show();
                return false
            }
            else if ($('#telephone').val().length < 1) {
                $('.erreur-msg').hide();
                $('#erreur-telephone').show();
                return false
            }
            $('.erreur-msg').hide();
            return true
        };

        function creerFormulaire() {
            let methode_paiement = $('input[name=methode_paiement]:checked', '#paiement-form').val();

            let panier = JSON.parse(localStorage.getItem('panier'))

            var jform = new FormData();

            jform.append('evenement', panier.evenement);
            jform.append('choix_personnage', panier.choix_personnage);
            jform.append('choix_ennemi', panier.choix_ennemi);
            jform.append('nom_personnage', panier.nom_personnage);
            jform.append('message_introduction', panier.message_introduction);
            jform.append('message_fin', panier.message_fin);
            jform.append('cadeau_1', panier.cadeau_1);
            jform.append('cadeau_2', panier.cadeau_2);
            jform.append('cadeau_3', panier.cadeau_3);
            jform.append('cadeau_4', panier.cadeau_4);
            // jform.append('date_cadeau', $('#date-cadeau').val());
            // jform.append('email_cadeau', $('#email-cadeau').val());
            jform.append('payeur_nom', $('#nom').val());
            jform.append('payeur_prenom', $('#prenom').val());
            jform.append('payeur_email', $('#email').val());
            jform.append('payeur_telephone', $('#telephone').val());
            jform.append('methode_paiement', methode_paiement);
            jform.append('_token', "{{ csrf_token() }}");

            return jform
        }

        // Passe la commande avec stripe
        $('#btn-commander-stripe').click(function(e){  
            e.preventDefault();
            
            if (valideChampsPanier()) {   
                let jform = creerFormulaire();  

                card.addEventListener('change', function(event) {
                    var displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });

                stripe.createToken(card).then(function(result) {
                    if (result.error) {
                        // Affiche erreur de carte
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    } else {
                        // Post la requête
                        stripeTokenHandler(result.token);
                    }
                });

                function stripeTokenHandler(token) {
                    // Insert the token ID into the form so it gets submitted to the server
                    var form = document.getElementById('champ-carte-bancaire');
                    var hiddenInput = document.createElement('input');
                    hiddenInput.setAttribute('type', 'hidden');
                    hiddenInput.setAttribute('name', 'stripeToken');
                    hiddenInput.setAttribute('value', token.id);
                    hiddenInput.setAttribute('id', 'stripeToken');
                    form.appendChild(hiddenInput);
                    jform.append('stripeToken', $('#stripeToken').val()); 
                    
                    
                    $.ajax({
                        type: 'POST',
                        url: '/achat',
                        data: jform,
                        dataType: 'json',
                        mimeType: 'multipart/form-data',
                        contentType: false,
                        processData: false,
                        beforeSend: function() {
                            $('#bg-loader').show();
                            $('#loader').show();
                        },
                        success:function(success){  
                            console.log(success);
                        },
                        complete:function(success){
                            $('#bg-loader').hide();
                            $('#loader').hide();
                            if (success.status === 200) {
                                $('#modale-succes-paiement').modal('show');
                            } else {
                                $('#modale-error-paiement').modal('show');
                            }
                        },
                        error: function(error){
                            console.log(error);
                        }
                    }); 
                }                  
            }
        });

        // Passe la commande avec Paypal
        $('#btn-commander-paypal').click(function(){ 
            if (valideChampsPanier()) {   
                let jform = creerFormulaire();
    
                $.ajax({
                    type: 'POST',
                    url: '/achat/paypal',
                    data: jform,
                    dataType: 'json',
                    mimeType: 'multipart/form-data',
                    contentType: false,
                    processData: false,
                    beforeSend: function() {
                        $('#bg-loader').show();
                        $('#loader').show();
                    },
                    success:function(success){  
                        console.log(success);
                    },
                    complete:function(success){
                        $('#bg-loader').hide();
                        $('#loader').hide();
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            }
        })

        $('#modale-succes-paiement').on('hide.bs.modal', function (e) {
            localStorage.clear();
            <?php Session::forget('info_commande'); ?>
            window.location.href = "/";
        })
    </script>
@stop