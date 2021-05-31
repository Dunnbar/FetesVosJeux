<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
// use App\Mail\CommandeConfirmation;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'AccueilController@index');


Route::get('/panier', 'AchatController@index');

Route::post('/achat', 'AchatController@achat');
Route::post('/achat/paypal', 'AchatController@achatPaypal');
Route::post('/achat/paypalvalide', 'AchatController@achatPaypalValide');

Route::post('paypal', array('as' => 'paypal','uses' => 'PaypalController@postPaymentWithpaypal'));
Route::get('paypal', array('as' => 'status','uses' => 'PaypalController@getPaymentStatus'));

Route::get('/{pack}', 'CustomisationController@index');

// Mail template
// Route::get('/email', function () {
//     Mail::to('mathieu.dessaint10@gmail.com')->send(new CommandeConfirmation());

//     return new CommandeConfirmation();
// });