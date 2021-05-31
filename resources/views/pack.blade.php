@extends('layout')

@section('page')
    <div class="container youplay-store">
        <div class="col-md-8 pr-50">
            <article>
                <h2 class="mt-0">Description Pack {{ $pack->evenement }}</h2><div class="side-block"><h4 class="block-title" style="width: 80px">{{ $pack->prix }}</h4></div>
                <div class="description">
                    <p>{{ $pack->description_pack }}</p>
                </div>
                <div class="btn-group social-list social-likes" data-counters="no">
                    <span class="btn btn-default facebook" title="Partager sur Facebook"></span>
                    <span class="btn btn-default twitter" title="Partager sur Twitter"></span>
                    <span class="btn btn-default plusone" title="Partager sur Google+"></span>
                    <span class="btn btn-default pinterest" title="Partager sur Pinterest" data-media=""></span>
                </div>
            </article>
            <div class="requirements-block">
                <h2>Configuration requise</h2>
                <div>
                    <strong>OS:</strong> Tablette ou téléphone Android </div>        
            </div>
        </div>
        <!-- Right Side -->
        <div class="col-md-4">
            <div class="side-block">
            <!-- <a href="/achat" id="btn-atc" class="btn btn-lg btn-atc" title="Passer la commande" data-toggle="modal" data-target="#myModal">Je veux ça !</a> -->
                <div id="myModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-cadeau">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Personnalisez votre jeu - Pack {{ $pack->evenement }}</h4>
                            </div>
                            <div class="modal-body">
                                <div class="side-block">
                                    <h4 class="block-title">Évènement</h4>
                                    <div class="youplay-input">
                                        <input id="evenement" type="text" name="evenement" value="Anniversaire" placeholder="Nom de l'évènement" disabled>
                                    </div> 
                                    <h4 class="block-title">Message d'introduction</h4>
                                    <div class="youplay-input">
                                        <textarea id="message-introduction" type="text" name="message-introduction" placeholder="Message d'introduction">{{ $pack->message_introduction }}</textarea>
                                    </div> 
                                </div>
                                <p>Les cadeaux sont facultatifs!</p>
                                <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                    <div class="row">
                                        <div class="col-md-6 panel-cadeau">
                                            <div class="panel panel-default">
                                                <div class="panel-heading" role="tab" id="headingOne">
                                                    <h4 class="panel-title">
                                                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne"> Ajouter un cadeau <span class="icon-plus"></span>
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseOne" class="panel-collapse collapse panel-cadeau-input" role="tabpanel" aria-labelledby="headingOne">
                                                    <div class="youplay-input">
                                                        <input id="cadeau-1" type="text" name="cadeau-1" placeholder="Nom du cadeau">
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 panel-cadeau">
                                            <div class="panel panel-default">
                                                <div class="panel-heading" role="tab" id="headingTwo">
                                                    <h4 class="panel-title">
                                                        <a class="collapsed" class="add-cadeau" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"> Ajouter un cadeau <span class="icon-plus"></span>
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseTwo" class="panel-collapse collapse panel-cadeau-input" role="tabpanel" aria-labelledby="headingTwo">
                                                    <div class="youplay-input">
                                                        <input id="cadeau-2" type="text" name="cadeau-2" placeholder="Nom du cadeau">
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 panel-cadeau">
                                            <div class="panel panel-default">
                                                <div class="panel-heading" role="tab" id="headingThree">
                                                    <h4 class="panel-title">
                                                        <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree"> Ajouter un cadeau <span class="icon-plus"></span>
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseThree" class="panel-collapse collapse panel-cadeau-input" role="tabpanel" aria-labelledby="headingThree">
                                                    <div class="youplay-input">
                                                        <input id="cadeau-3" type="text" name="cadeau-3" placeholder="Nom du cadeau">
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 panel-cadeau">
                                            <div class="panel panel-default">
                                                <div class="panel-heading" role="tab" id="headingFour">
                                                    <h4 class="panel-title">
                                                        <a class="collapsed" class="add-cadeau" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseTwo"> Ajouter un cadeau <span class="icon-plus"></span>
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseFour" class="panel-collapse collapse panel-cadeau-input" role="tabpanel" aria-labelledby="headingFour">
                                                    <div class="youplay-input">
                                                        <input id="cadeau-4" type="text" name="cadeau-4" placeholder="Nom du cadeau">
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="side-block">
                                    <h4 class="block-title">Message de fin</h4>
                                    <div class="youplay-input">
                                        <textarea id="message-fin" type="text" name="search" placeholder="Votre message de fin...">{{ $pack->message_fin }}</textarea>
                                    </div>
                                    <p id="erreur-msg-modal">Remplissez les champs manquants*</p>               
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default btn-atc" id="btn-atc" >Continuer</button>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Retour</button>
                            </div>
                        </div>
                    </div>
                </div>

            <!-- <h4 class="block-title" style="width: 80px">$15</h4> -->
            </div>
            <div class="side-block">
                <h4 class="block-title">Choisissez le personnage principal</h4>
                <form id="personnage-form">
                    <div class="row youplay-radio form-check-inline"> 
                        <div class="row-img col-md-6">
                            <img src="assets/images/fetesvosjeux/ennemi/cochon_1.png" alt="personnage_1" width="100px">
                            <input class="form-check-input btn-personnage" type="radio" name="choix-personnage" id="personnage_1" value="personnage_1" checked>
                            <label class="form-check-label" for="personnage_1"></label>
                        </div>
                        <div class="row-img col-md-6">
                            <img src="assets/images/fetesvosjeux/ennemi/cochon_4.png" alt="personnage_4" width="100px">
                            <input class="form-check-input btn-personnage" type="radio" name="choix-personnage" id="personnage_4" value="personnage_4">
                            <label class="form-check-label" for="personnage_4"></label>
                        </div>     
                    </div>
                    <div class="row youplay-radio form-check-inline"> 
                        <div class="row-img col-md-6">
                            <img src="assets/images/fetesvosjeux/ennemi/cochon_2.png" alt="personnage_2" width="100px">
                            <input class="form-check-input btn-personnage" type="radio" name="choix-personnage" id="personnage_2" value="personnage_2">
                            <label class="form-check-label" for="personnage_2"></label>
                        </div>
                        <div class="row-img col-md-6">
                            <img src="assets/images/fetesvosjeux/ennemi/cochon_5.png" alt="personnage_5" width="100px">
                            <input class="form-check-input btn-personnage" type="radio" name="choix-personnage" id="personnage_5" value="personnage_5">
                            <label class="form-check-label" for="personnage_5"></label>
                        </div>     
                    </div>
                    <div class="row youplay-radio form-check-inline"> 
                        <div class="row-img col-md-6">
                            <img src="assets/images/fetesvosjeux/ennemi/cochon_3.png" alt="personnage_3" width="100px">
                            <input class="form-check-input btn-personnage" type="radio" name="choix-personnage" id="personnage_3" value="personnage_3">
                            <label class="form-check-label" for="personnage_3"></label>
                        </div>
                        <div class="row-img col-md-6">
                            <img src="assets/images/fetesvosjeux/ennemi/cochon_6.png" alt="personnage_6" width="100px">
                            <input class="form-check-input btn-personnage" type="radio" name="choix-personnage" id="personnage_6" value="personnage_6">
                            <label class="form-check-label" for="personnage_6"></label>
                        </div>     
                    </div>
                </form>

                <div class="">
                    <!-- <p>Nom du personnage</p> -->
                    <div class="youplay-input">
                        <input id="nom-personnage" type="text" name="nom-personnage" placeholder="Nom du personnage">
                    </div>
                </div>
            </div>

            <div class="side-block">
                <h4 class="block-title">Choisissez l'ennemi</h4>
                    <form id="ennemi-form">
                        <div class="row youplay-radio form-check-inline"> 
                            <div class="row-img col-md-6">
                                <img src="assets/images/fetesvosjeux/ennemi/cochon_1.png" alt="cochon_1" width="100px">
                                <input class="form-check-input btn-ennemi" type="radio" name="choix-ennemi" id="cochon_1" value="cochon_1" checked>
                                <label class="form-check-label" for="cochon_1"></label>
                            </div>
                            <div class="row-img col-md-6">
                                <img src="assets/images/fetesvosjeux/ennemi/cochon_4.png" alt="cochon_4" width="100px">
                                <input class="form-check-input btn-ennemi" type="radio" name="choix-ennemi" id="cochon_4" value="cochon_4">
                                <label class="form-check-label" for="cochon_4"></label>
                            </div>     
                        </div>
                        <div class="row youplay-radio form-check-inline"> 
                            <div class="row-img col-md-6">
                                <img src="assets/images/fetesvosjeux/ennemi/cochon_2.png" alt="cochon_2" width="100px">
                                <input class="form-check-input btn-ennemi" type="radio" name="choix-ennemi" id="cochon_2" value="cochon_2">
                                <label class="form-check-label" for="cochon_2"></label>
                            </div>
                            <div class="row-img col-md-6">
                                <img src="assets/images/fetesvosjeux/ennemi/cochon_5.png" alt="cochon_5" width="100px">
                                <input class="form-check-input btn-ennemi" type="radio" name="choix-ennemi" id="cochon_5" value="cochon_5">
                                <label class="form-check-label" for="cochon_5"></label>
                            </div>     
                        </div>
                        <div class="row youplay-radio form-check-inline"> 
                            <div class="row-img col-md-6">
                                <img src="assets/images/fetesvosjeux/ennemi/cochon_3.png" alt="cochon_3" width="100px">
                                <input class="form-check-input btn-ennemi" type="radio" name="choix-ennemi" id="cochon_3" value="cochon_3">
                                <label class="form-check-label" for="cochon_3"></label>
                            </div>
                            <div class="row-img col-md-6">
                                <img src="assets/images/fetesvosjeux/ennemi/cochon_6.png" alt="cochon_6" width="100px">
                                <input class="form-check-input btn-ennemi" type="radio" name="choix-ennemi" id="cochon_6" value="cochon_6">
                                <label class="form-check-label" for="cochon_6"></label>
                            </div>     
                        </div>      
                    </form>
                <button type="button" id="montre-modal" class="btn btn-lg btn-atc" title="Passer la commande" data-toggle="modal" data-target="#myModal">Je veux ça !</button>
                <p id="erreur-msg-accueil">Choisissez d'abord un nom pour votre personnage</p>
            </div>
            <!-- <div class="side-block">
                <h4 class="block-title">Votre message personnalisé</h4>
                <div class="youplay-input">
                    <textarea id="message-personnalise" type="text" name="search" placeholder="Votre message..."></textarea>
                </div>
            </div> -->
        </div>
    </div>
@stop

@section('custom_scripts')
    <script>
        // Vérifie que les champs ne soient pas vide
        function valideChampsModal() {
            if ($('#message-introduction').val().length < 1 ||
                $('#evenement').val().length < 1 ||
                $('#message-fin').val().length < 1) {
                return false
            }
            return true
        };

        $('#montre-modal').click(function(e){
            if ($('#nom-personnage').val().length < 1) {
                e.stopPropagation();
                $('#erreur-msg-accueil').show()
            }
            else {
                $('#erreur-msg-accueil').hide()
            }
        })

        $('#btn-atc').click(function(e){  
            e.preventDefault()
            if (valideChampsModal()) {
                $('#erreur-msg-modal').hide();

                let panier = {
                    evenement: $('#evenement').val(),
                    message_introduction: $('#message-introduction').val(),
                    cadeau_1: $('#cadeau-1').val(),
                    cadeau_2: $('#cadeau-2').val(),
                    cadeau_3: $('#cadeau-3').val(),
                    cadeau_4: $('#cadeau-4').val(),
                    message_fin: $('#message-fin').val(),
                    nom_personnage: $('#nom-personnage').val(),
                    choix_personnage: $('input[name=choix-personnage]:checked', '#personnage-form').val(),
                    choix_ennemi: $('input[name=choix-ennemi]:checked', '#ennemi-form').val(),
                }

                localStorage.clear();
                localStorage.setItem('panier', JSON.stringify(panier));
                window.location.href = "/panier";
            } else {
                $('#erreur-msg-modal').show();
            }
        });
    </script>
@stop