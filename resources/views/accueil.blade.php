@extends('layout')

@section('page')
    <div class="content-wrap no-banner">
        <div class="container youplay-store store-grid">
            <!-- <div class="col-md-9 isotope"> -->
            <div class="col-md-12 isotope">
                <h2 class="mt-0">Choisissez le thème de votre jeu personnalisé</h2>
                <div class="isotope-list row vertical-gutter">
                @foreach ($packs as $pack)
                    <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="popular">
                        <a href="/{{ $pack->nom_pack }}" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/fetesvosjeux/bg.png" alt="Pack {{ $pack->evenement }}">
                                <!-- <img src="{{ $pack->image_url }}" alt="Pack {{ $pack->evenement }}"> -->
                            </div>
                            <div class="bottom-info">
                                <h4>Pack {{ $pack->evenement }}</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> ${{ $pack->prix}} </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                @endforeach
                    <!-- <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="popular">
                        <a href="/anniversaire" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/fetesvosjeux/bg.png" alt="Pack Anniversaire">
                            </div>
                            <div class="bottom-info">
                                <h4>Pack Anniversaire</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="popular,specials">
                        <a href="/noel" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/fetesvosjeux/bg.png" alt="Pack Anniversaire">
                            </div>
                            <div class="bottom-info">
                                <h4>Pack Noël</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="popular">
                        <a href="/fete" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/fetesvosjeux/bg.png" alt="Pack Anniversaire">
                            </div>
                            <div class="bottom-info">
                                <h4>Pack Fête</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="">
                        <a href="/mariage" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/light/game-broken-age-500x375.jpg" alt="">
                            </div>
                            <div class="bottom-info">
                                <h4>Pack Mariage</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="specials">
                        <a href="/naissance" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/light/game-flower-500x375.jpg" alt="">
                            </div>
                            <div class="bottom-info">
                                <h4>Pack Naissance</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 <sup></sup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="">
                        <a href="/diplome" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/light/game-no-mans-sky-500x375.jpg" alt="">
                            </div>
                            <div class="bottom-info">
                                <h4>Pack Diplôme</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div> -->
                    <!-- <div class="item col-lg-4 col-md-6 col-xs-12" data-filters="">
                        <a href="/custom" class="angled-img">
                            <div class="img img-offset">
                                <img src="assets/images/light/game-no-mans-sky-500x375.jpg" alt="">
                            </div>
                            <div class="bottom-info">
                                <h4>Je créé mon propre pack</h4>
                                <div class="row">
                                    <div class="">
                                        <div class="price"> $15 </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div> -->
                </div>
            </div>
            <!-- Right Side -->
            <!-- <div class="col-md-3">
                <div class="side-block">
                    <h4 class="block-title">Categories</h4>
                    <ul class="block-content">
                        <li><a href="#">All</a></li>
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Adventure</a></li>
                        <li><a href="#">Casual</a></li>
                        <li><a href="#">Indie</a></li>
                        <li><a href="#">Racing</a></li>
                        <li><a href="#">RPG</a></li>
                        <li><a href="#">Simulation</a></li>
                        <li><a href="#">Strategy</a></li>
                    </ul>
                </div>
                <div class="side-block">
                    <h4 class="block-title">Popular Games</h4>
                    <div class="block-content p-0">
                        <div class="row youplay-side-news">
                            <div class="col-xs-3 col-md-4">
                                <a href="light-store-product-1.html" class="angled-img">
                                    <div class="img">
                                        <img src="assets/images/light/game-road-no-taken-500x375.jpg" alt="">
                                    </div>
                                </a>
                            </div>
                            <div class="col-xs-9 col-md-8">
                                <h4 class="ellipsis"><a href="light-store-product-1.html" title="Road Not Taken">Road Not Taken</a></h4>
                                <span class="price">$50.00</span>
                            </div>
                        </div>
                        <div class="row youplay-side-news">
                            <div class="col-xs-3 col-md-4">
                                <a href="#" class="angled-img">
                                    <div class="img">
                                        <img src="assets/images/light/game-botanicula-500x375.jpg" alt="">
                                    </div>
                                </a>
                            </div>
                            <div class="col-xs-9 col-md-8">
                                <h4 class="ellipsis"><a href="#" title="Botanicula">Botanicula</a></h4>
                                <span class="price">$39.99 <sup><del>$49.99</del></sup></span>
                            </div>
                        </div>
                        <div class="row youplay-side-news">
                            <div class="col-xs-3 col-md-4">
                                <a href="#" class="angled-img">
                                    <div class="img">
                                        <img src="assets/images/light/game-journey-500x375.jpg" alt="">
                                    </div>
                                </a>
                            </div>
                            <div class="col-xs-9 col-md-8">
                                <h4 class="ellipsis"><a href="#" title="Journey">Journey</a></h4>
                                <span class="price">$20.00</span>
                            </div>
                        </div>
                        <div class="row youplay-side-news">
                            <div class="col-xs-3 col-md-4">
                                <a href="#" class="angled-img">
                                    <div class="img">
                                        <img src="assets/images/light/game-world-of-goo-500x375.jpg" alt="">
                                    </div>
                                </a>
                            </div>
                            <div class="col-xs-9 col-md-8">
                                <h4 class="ellipsis"><a href="#" title="World of Goo">World of Goo</a></h4>
                                <span class="price">$10.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- /Right Side -->
        </div>
    </div>
@stop

@section('custom_scripts')
    <script>

    </script>
@stop