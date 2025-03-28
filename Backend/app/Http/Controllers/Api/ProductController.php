<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            Log::info('ProductController@index kaldt');

            // Get query parameters
            $limit = $request->input('limit', null);
            $sortBy = $request->input('sort_by', 'sort_order');
            $sortDirection = $request->input('sort_direction', 'asc');

            // Validate sort parameters to prevent SQL injection
            $allowedSortFields = ['id', 'name', 'price', 'sort_order', 'created_at'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'sort_order';
            }

            if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
                $sortDirection = 'asc';
            }

            // Build query
            $query = Product::orderBy($sortBy, $sortDirection);

            // Apply limit if specified
            if (is_numeric($limit) && $limit > 0) {
                $query->limit($limit);
            }

            // Execute query
            $products = $query->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            Log::error('Fejl i ProductController@index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
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
