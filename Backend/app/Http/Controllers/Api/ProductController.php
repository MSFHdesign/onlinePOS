<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        try {
            Log::info('ProductController@index kaldt');
            $products = Product::orderBy('sort_order')->get();
            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Fejl i ProductController@index: ' . $e->getMessage());
            return response()->json([
                'error' => 'Der opstod en serverfejl.',
                'message' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $product = Product::create($request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'vat' => 'required|numeric',
            'tag_name' => 'nullable|string',
            'tag_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]));

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'vat' => 'required|numeric',
            'tag_name' => 'nullable|string',
            'tag_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]));

        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }

    public function sort(Request $request)
    {
        foreach ($request->input('order') as $index => $id) {
            Product::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Sortering opdateret']);
    }
}
