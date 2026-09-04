<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    // Inventory model
public function items()
{
    return $this->hasMany(InventoryItem::class);
}
}
