<?php

Kirby::plugin('custom/method', [
    'pageMethods' => [
        'pluckCategoryNames' => function () {
            $categories = [];
           
            foreach ($this->childrenAndDrafts() as $page) {
                if ($page->dynamic_category()->isNotEmpty()) {
                    foreach ($page->dynamic_category()->toStructure() as $item) {
                        if ($item !== null && $item->category_box_name()->isNotEmpty()) {
                            $categories[] = $item->category_box_name()->value();
                        }
                    }
                }
            }
            
            return array_unique($categories);
        },

        'pluckCategoryBoxes' => function () {
            $categories = [];
          
            foreach ($this->childrenAndDrafts() as $page) {
                if ($page->dynamic_category()->isNotEmpty()) {
                    foreach ($page->dynamic_category()->toStructure() as $item) {
                        if ($item !== null && $item->category_box()->isNotEmpty()) {
                            foreach ($item->category_box()->split(',') as $tag) {
                                $categories[] = $tag;
                            }
                        }
                    }
                }
            }

            return array_unique($categories);
        }
    ]
]);

// Kirby::plugin('custom/method', [
//     'pageMethods' => [
//         'pluckCategoryNames' => function () {
//             $categories = [];
           
//             foreach ($this->childrenAndDrafts() as $page) {
//                 if ($page->dynamic_category()->isNotEmpty()) {
//                     foreach ($page->dynamic_category()->toStructure() as $item) {
//                         $categories[] = $item->category_box_name()->value();
//                     }
//                 }
//             }
            
//             return array_unique($categories);
//         },

//         'pluckCategoryBoxes' => function () {
//             $categories = [];
          
//             foreach ($this->childrenAndDrafts() as $page) {
//                 if ($page->dynamic_category()->isNotEmpty()) {
//                     foreach ($page->dynamic_category()->toStructure() as $item) {
//                         if ($item->category_box()->isNotEmpty()) {
//                             foreach ($item->category_box()->split(',') as $tag) {
//                                 $categories[] = $tag;
//                             }
//                         }
//                     }
//                 }
//             }

//             return array_unique($categories);
//         }
//     ]
// ]);
