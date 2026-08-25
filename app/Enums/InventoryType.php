<?php

namespace App\Enums;

enum InventoryType: string
{
    case Purchase='purchase';
    case Transfer='transfer';
    case Wastage='wastage';
}
