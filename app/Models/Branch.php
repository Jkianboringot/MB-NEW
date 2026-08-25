<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
  protected $fillable = ['location', 'type_branch'];


  // public function ingredients(): BelongsToMany
  // {
  //   return $this->belongsToMany(Ingredient::class, 'ingredient_branchs');
  // }



  public function addIngredients(): HasMany
  {
    return $this->hasMany(AddIngredient::class);
  }

  public function order(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  public function reuturned(): HasMany
  {
    return $this->hasMany(Returned::class);
  }
  public function users(): HasMany
  {
    return $this->hasMany(User::class);
  }


}
