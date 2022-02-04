import { cloneDeep, flatten, flattenDeep } from 'lodash';

const attributes = [
  {
    id: 4,
    product_types_id: 14,
    attribute_name: 'Size',
    created_at: '2022-01-19T15:05:44.000000Z',
    values: [
      {
        id: 10,
        product_type_attributes_id: 4,
        attribute_value: 'A4',
        created_at: '2022-01-19T15:05:44.000000Z',
      },
      {
        id: 11,
        product_type_attributes_id: 4,
        attribute_value: 'A5',
        created_at: '2022-01-19T15:05:44.000000Z',
      },
      //   {
      //       "id": 12,
      //       "product_type_attributes_id": 4,
      //       "attribute_value": "A6",
      //       "created_at": "2022-01-19T15:05:44.000000Z"
      //   },
      //   {
      //       "id": 14,
      //       "product_type_attributes_id": 4,
      //       "attribute_value": "A7",
      //       "created_at": "2022-01-19T16:42:27.000000Z"
      //   },
      //   {
      //       "id": 15,
      //       "product_type_attributes_id": 4,
      //       "attribute_value": "A8",
      //       "created_at": "2022-01-19T16:42:27.000000Z"
      //   }
    ],
  },
  {
    id: 5,
    product_types_id: 14,
    attribute_name: 'Color',
    created_at: '2022-01-25T11:27:35.000000Z',
    values: [
      {
        id: 16,
        product_type_attributes_id: 5,
        attribute_value: 'Brown',
        created_at: '2022-01-25T11:27:35.000000Z',
      },
      {
        id: 17,
        product_type_attributes_id: 5,
        attribute_value: 'White',
        created_at: '2022-01-25T11:27:35.000000Z',
      },
      {
        id: 18,
        product_type_attributes_id: 5,
        attribute_value: 'Green',
        created_at: '2022-01-25T11:27:35.000000Z',
      },
    ],
  },
  {
    id: 6,
    product_types_id: 14,
    attribute_name: 'Tickness',
    created_at: '2022-01-25T11:28:25.000000Z',
    values: [
      {
        id: 18,
        product_type_attributes_id: 6,
        attribute_value: 'Thin',
        created_at: '2022-01-25T11:28:25.000000Z',
      },
      {
        id: 19,
        product_type_attributes_id: 6,
        attribute_value: 'Thick',
        created_at: '2022-01-25T11:28:25.000000Z',
      },
    ],
  },
];

function generateOptionsFromAttributeValues(values) {
  return values.map((rv) => ({
    label: rv.attribute_value,
    value: rv.id,
  }));
}

function generateVariations(
  next_index,
  loop_index,
  row,
  variations_stack = [],
  variations_map
) {
  if (variations_map[next_index]) {
    const next_attr_values = variations_map[next_index];
    const pos = loop_index;
    const next_attr_value_options =
      generateOptionsFromAttributeValues(next_attr_values);

    for (const each_attr_value of next_attr_values) {
      if (!variations_stack[pos]) {
        variations_stack.push([]);
      }
      each_attr_value.options = next_attr_value_options;
      variations_stack[pos].push([row, each_attr_value]);
    }
  }

  if (variations_map[next_index + 1]) {
    const curr_pos = loop_index;
    const future_attr_values = variations_map[next_index + 1];
    if (variations_stack[curr_pos]) {
      const new_variation_set = [];
      const options = generateOptionsFromAttributeValues(future_attr_values);

      for (const future_attr_value of future_attr_values) {
        for (const each_variation_stack of variations_stack[curr_pos]) {
          const cloned_variation_stack = cloneDeep(each_variation_stack);
          future_attr_value.options = options;
          cloned_variation_stack.push(future_attr_value);

          new_variation_set.push(cloneDeep(cloned_variation_stack));
        }
      }
      variations_stack.splice(curr_pos, 1, new_variation_set);
    }

    if (variations_map[next_index + 2]) {
      generateVariations(next_index + 2, loop_index, row, variations_stack);
    }
  }

  return variations_stack;
}

function prepareAndGenerateProductTypeAttributeVariations(attributes) {
  const start_index = 0;
  const variations_map = attributes.map((attr) => attr.values);
  const next_attribute_values = variations_map[start_index];
  const row_options = generateOptionsFromAttributeValues(next_attribute_values);
  let stored_variations = [];

  for (let i = 0; i < next_attribute_values.length; i++) {
    const attr_row = next_attribute_values[i];
    attr_row.options = row_options;
    const variations = generateVariations(
      start_index + 1,
      i,
      attr_row,
      cloneDeep(stored_variations),
      variations_map
    );
    stored_variations = variations;
  }

  console.log(flatten(stored_variations));
}

prepareAndGenerateProductTypeAttributeVariations(attributes);
