<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <title>Fêtes Vos Jeux Vidéos</title>

        <meta name="description" content="Offrez un jeu personnalisé !">
        <meta name="keywords" content="jeu, jeu personnalisé, cadeau, cadeau personnalisé">
        <meta name="author" content="Esperluette">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <!-- START: Styles -->
        <!-- Google Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:300,400,700">
        <!-- Bootstrap -->
        <link rel="stylesheet" href="assets/vendor/bootstrap/dist/css/bootstrap.min.css" />
        <!-- Flickity -->
        <link rel="stylesheet" href="assets/vendor/flickity/dist/flickity.min.css" />
        <!-- Magnific Popup -->
        <link rel="stylesheet" href="assets/vendor/magnific-popup/dist/magnific-popup.css" />
        <!-- Revolution Slider -->
        <link rel="stylesheet" href="assets/vendor/slider-revolution/css/settings.css">
        <link rel="stylesheet" href="assets/vendor/slider-revolution/css/layers.css">
        <link rel="stylesheet" href="assets/vendor/slider-revolution/css/navigation.css">
        <!-- Bootstrap Sweetalert -->
        <link rel="stylesheet" href="assets/vendor/bootstrap-sweetalert/dist/sweetalert.css" />
        <!-- Social Likes -->
        <link rel="stylesheet" href="assets/vendor/social-likes/dist/social-likes_flat.css" />
        <!-- FontAwesome -->
        <script defer src="assets/vendor/fontawesome-free/js/all.js"></script>
        <script defer src="assets/vendor/fontawesome-free/js/v4-shims.js"></script>
        <!-- Youplay -->
        <link rel="stylesheet" href="assets/css/youplay-light.css">
        <!-- RTL (uncomment this to enable RTL support) -->
        <!-- <link rel="stylesheet" href="assets/css/youplay-rtl.min.css" /> -->
        <!-- Custom Styles -->
        <link rel="stylesheet" href="assets/css/custom.css">
        <link rel="stylesheet" href="css/custom.css">
        <!-- END: Styles -->
        <!-- Fonts -->

        <!-- Style -->
        <link rel="stylesheet" href="{{ asset('assets/css/custom.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/youplay-light.css') }}">
        @yield('header_styles')
    </head>
    <body>
        <div id="loader"></div> 
        <div id="bg-loader"></div>  
        <!-- Preloader -->
        <div class="page-preloader preloader-wrapp">
            <img src="assets/images/light/logo.png" alt="">
            <div class="preloader"></div>
        </div>
        
        <!-- Navbar -->
        <nav class="navbar-youplay navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div id="logo" class="navbar-header">
                    <!-- <button type="button" class="navbar-toggle collapsed" data-toggle="off-canvas" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button> -->
                    <!-- <a id="logo2" class="navbar-brand" href="/">
                        LOGO
                    </a> -->
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li class="dropdown dropdown-hover">
                            <a href="/" role="button" aria-expanded="false"> Accueil 
                            </a>
                        </li>
                        <li class="dropdown dropdown-hover">
                            <a href="/panier" role="button" aria-expanded="false"> Panier
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- /Navbar -->
        <div class="content-wrap">
            <!-- <section class="youplay-banner banner-top youplay-banner-parallax"> -->

            <!-- <section class="youplay-banner banner-top">
                <div class="accueil-image image" data-speed="0.4">
                    <img id="accueil-img" src="https://public-files.gumroad.com/variants/m2x1so8bkg5ckq5xzszficltkguf/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background" class="jarallax-img">
                </div>
            </section> -->


            <div id="my-pics"  id="carousel-accueil" class="carousel slide" data-interval="false" style="margin:auto;">

                <ol class="carousel-indicators">
                    <li id="slide-1" class="slide" data-target="#my-pics" data-slide-to="0" class="active"></li>
                    <li id="slide-2" class="slide" data-target="#my-pics" data-slide-to="1"></li>
                    <li id="slide-3" class="slide" data-target="#my-pics" data-slide-to="2"></li>
                    <li id="slide-4" class="slide" data-target="#my-pics" data-slide-to="3"></li>
                    <li id="slide-5" class="slide" data-target="#my-pics" data-slide-to="4"></li>
                    <li id="slide-6" class="slide" data-target="#my-pics" data-slide-to="5"></li>
                    <li id="slide-7" class="slide" data-target="#my-pics" data-slide-to="6"></li>
                </ol>

                <div class="carousel-inner" role="listbox">
                    <div id="item-1" class="item active">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/m2x1so8bkg5ckq5xzszficltkguf/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>

                    <div id="item-2" class="item">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/3tlk25miyph5svy0g8z9k85govop/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>

                    <div id="item-3" class="item">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/80ujetfoc368xq9gn723gc2v8k5s/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>

                    <div id="item-4" class="item">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/wc77dsro3hpa643phygg290jpjju/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>

                    <div id="item-5" class="item">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/i2wx2ld38evgrof43s54ju864cy0/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>

                    <div id="item-6" class="item">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/gtxsjs8vou4th6bwwaefr48gt069/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>

                    <div id="item-7" class="item">
                        <img class="img-carousel" src="https://public-files.gumroad.com/variants/ymq8itfv2j07e19ij4ep8bszafyg/3298c3eb001bbed90f1d616da66708480096a0a1b6e81bd4f8a2d6e9b831d301" alt="accueil background">
                    </div>
                </div>
                <a class="left carousel-control" href="#my-pics" role="button" data-slide="prev">
                    <span class="icon-prev" aria-hidden="true"></span>
                    <span class="sr-only">Précédent</span>
                </a>
                <a class="right carousel-control" href="#my-pics" role="button" data-slide="next">
                    <span class="icon-next" aria-hidden="true"></span>
                    <span class="sr-only">Suivant</span>
                </a>
            </div>

            @yield('page')
               
            <!-- Footer -->
            <footer class="youplay-footer youplay-footer-parallax">
                <div class="image" data-speed="0.4" data-img-position="50% 0%">
                    <img src="assets/images/light/footer-bg.jpg" alt="" class="jarallax-img">
                </div>
                <div class="wrapper">
                    <!-- /Social Buttons -->
                    <!-- Copyright -->
                    <div class="copyright">
                        <div class="container">
                            <p>2021 &copy; <strong>Esperluette</strong>. Tous droits réservés</p>
                        </div>
                    </div>
                    <!-- /Copyright -->
                </div>
            </footer>
            <!-- /Footer -->
        </div>
        <!-- Search Block -->
        <div class="search-block">
            <a href="#" class="search-toggle">
                <i class="fa fa-times"></i>
            </a>
            <form action="search.html">
                <div class="youplay-input">
                    <input type="text" name="search" placeholder="Search...">
                </div>
            </form>
        </div>
        <!-- /Search Block -->
        <!-- START: Scripts -->
        <!-- Object Fit Polyfill -->
        <script src="assets/vendor/object-fit-images/dist/ofi.min.js"></script>
        <!-- jQuery -->
        <script src="assets/vendor/jquery/dist/jquery.min.js"></script>
        <!-- Stripe -->
        <script src="https://js.stripe.com/v3/"></script>
        <!-- Hexagon Progress -->
        <script src="assets/vendor/HexagonProgress/jquery.hexagonprogress.min.js"></script>
        <!-- Bootstrap -->
        <script src="assets/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
        <!-- Jarallax -->
        <script src="assets/vendor/jarallax/dist/jarallax.min.js"></script>
        <!-- Flickity -->
        <script src="assets/vendor/flickity/dist/flickity.pkgd.min.js"></script>
        <!-- jQuery Countdown -->
        <script src="assets/vendor/jquery-countdown/dist/jquery.countdown.min.js"></script>
        <!-- Moment.js -->
        <script src="assets/vendor/moment/min/moment.min.js"></script>
        <script src="assets/vendor/moment-timezone/builds/moment-timezone-with-data.min.js"></script>
        <!-- Magnific Popup -->
        <script src="assets/vendor/magnific-popup/dist/jquery.magnific-popup.min.js"></script>
        <!-- Revolution Slider -->
        <script src="assets/vendor/slider-revolution/js/jquery.themepunch.tools.min.js"></script>
        <script src="assets/vendor/slider-revolution/js/jquery.themepunch.revolution.min.js"></script>
        <!-- ImagesLoaded -->
        <script src="assets/vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
        <!-- Isotope -->
        <script src="assets/vendor/isotope-layout/dist/isotope.pkgd.min.js"></script>
        <!-- Bootstrap Validator -->
        <script src="assets/vendor/bootstrap-validator/dist/validator.min.js"></script>
        <!-- Bootstrap Sweetalert -->
        <script src="assets/vendor/bootstrap-sweetalert/dist/sweetalert.min.js"></script>
        <!-- Social Likes -->
        <script src="assets/vendor/social-likes/dist/social-likes.min.js"></script>
        <!-- Youplay -->
        <script src="assets/js/youplay.min.js"></script>
        <script src="assets/js/youplay-init.js"></script>
        <!-- END: Scripts -->
        @yield('custom_scripts')
    </body>
</html>
