/**
 * Property-Based Tests for createField factory function
 *
 * **Feature: form-component-fixes, Property 4: createField Returns Valid Component**
 * **Validates: Requirements 2.1**
 */
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { createField, type CreateFieldConfig } from '../utils/create-field'

// Arbitrary for generating valid component names (PascalCase)
const componentNameArb = fc
  .stringMatching(/^[A-Z][a-zA-Z0-9]{2,20}$/)
  .filter((name) => name.length >= 3 && name.length <= 21)

// Arbitrary for generating valid valueType strings
const valueTypeArb = fc.constantFrom(
  'text',
  'password',
  'money',
  'textarea',
  'date',
  'dateTime',
  'dateWeek',
  'dateMonth',
  'dateQuarter',
  'dateYear',
  'dateRange',
  'time',
  'timeRange',
  'select',
  'checkbox',
  'rate',
  'radio',
  'switch',
  'digit',
  'percent',
  'progress',
  'code',
  'jsonCode',
  'avatar',
  'image',
  'cascader',
  'treeSelect',
  'color',
  'segmented',
)

// Arbitrary for generating CreateFieldConfig
const createFieldConfigArb: fc.Arbitrary<CreateFieldConfig> = fc.record({
  name: componentNameArb,
  renderFormItem: fc.constant((props: any) => {
    // Return a simple input element for testing
    return h('input', {
      type: 'text',
      value: props.modelValue?.value ?? '',
      onInput: (e: Event) => {
        const target = e.target as HTMLInputElement
        if (props.modelValue) {
          props.modelValue.value = target.value
        }
      },
    })
  }),
  valueType: fc.option(valueTypeArb, { nil: undefined }),
  ignoreWidth: fc.option(fc.boolean(), { nil: undefined }),
  customLightMode: fc.option(fc.boolean(), { nil: undefined }),
})

describe('createField Property Tests', () => {
  /**
   * **Feature: form-component-fixes, Property 4: createField Returns Valid Component**
   * **Validates: Requirements 2.1**
   *
   * Property: For any valid CreateFieldConfig, calling createField SHALL return
   * a Vue component that can be rendered without errors.
   */
  it('should return a valid Vue component for any valid config', () => {
    fc.assert(
      fc.property(createFieldConfigArb, (config) => {
        // Act: Create the field component
        const FieldComponent = createField(config)

        // Assert: Component has correct name
        expect(FieldComponent.name).toBe(config.name)

        // Assert: Component has inheritAttrs set to false
        expect(FieldComponent.inheritAttrs).toBe(false)

        // Assert: Component is a valid Vue component (has setup function)
        expect(typeof FieldComponent.setup).toBe('function')

        // Assert: Component has required props defined
        expect(FieldComponent.props).toBeDefined()
        expect(FieldComponent.props).toHaveProperty('name')
        expect(FieldComponent.props).toHaveProperty('label')
        expect(FieldComponent.props).toHaveProperty('modelValue')
        expect(FieldComponent.props).toHaveProperty('fieldProps')

        // Assert: Component has emits defined
        expect(FieldComponent.emits).toContain('update:modelValue')
        expect(FieldComponent.emits).toContain('change')
      }),
      { numRuns: 100 },
    )
  })

  /**
   * **Feature: form-component-fixes, Property 4: createField Returns Valid Component**
   * **Validates: Requirements 2.1**
   *
   * Property: For any valid CreateFieldConfig, the created component can be
   * mounted and rendered without throwing errors.
   */
  it('should create a component that can be mounted without errors', () => {
    fc.assert(
      fc.property(createFieldConfigArb, (config) => {
        // Act: Create the field component
        const FieldComponent = createField(config)

        // Act: Mount the component
        const wrapper = mount(FieldComponent, {
          props: {
            name: 'testField',
            label: 'Test Label',
          },
          global: {
            stubs: {
              // Stub TDesign FormItem to avoid dependency issues
              TFormItem: {
                template: '<div class="t-form-item"><slot /></div>',
              },
            },
          },
        })

        // Assert: Component is mounted successfully
        expect(wrapper.exists()).toBe(true)

        // Assert: Component renders without errors
        expect(wrapper.html()).toBeTruthy()

        // Cleanup
        wrapper.unmount()
      }),
      { numRuns: 100 },
    )
  })

  /**
   * **Feature: form-component-fixes, Property 4: createField Returns Valid Component**
   * **Validates: Requirements 2.1**
   *
   * Property: The renderFormItem function receives the correct props structure.
   */
  it('should pass correct props to renderFormItem function', () => {
    fc.assert(
      fc.property(
        createFieldConfigArb,
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (config, fieldName, labelText) => {
          let receivedProps: any = null

          // Create config with a spy renderFormItem
          const spyConfig: CreateFieldConfig = {
            ...config,
            renderFormItem: (props: any) => {
              receivedProps = props
              return h('input', { type: 'text' })
            },
          }

          // Create and mount the component
          const FieldComponent = createField(spyConfig)
          const wrapper = mount(FieldComponent, {
            props: {
              name: fieldName,
              label: labelText,
              ignoreFormItem: true, // Skip ProFormItem wrapper for direct testing
            },
          })

          // Assert: renderFormItem was called with props
          expect(receivedProps).not.toBeNull()
          expect(receivedProps.name).toBe(fieldName)
          expect(receivedProps.label).toBe(labelText)
          expect(receivedProps.modelValue).toBeDefined()
          expect(receivedProps.mode).toBeDefined()
          expect(receivedProps.fieldProps).toBeDefined()

          wrapper.unmount()
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * **Feature: form-component-fixes, Property 4: createField Returns Valid Component**
   * **Validates: Requirements 2.1**
   *
   * Property: The valueType from config is correctly set as default prop value.
   */
  it('should use config valueType as default prop value', () => {
    fc.assert(
      fc.property(componentNameArb, valueTypeArb, (name, valueType) => {
        const config: CreateFieldConfig = {
          name,
          valueType,
          renderFormItem: () => h('input', { type: 'text' }),
        }

        const FieldComponent = createField(config)

        // Assert: valueType prop has correct default
        const valueTypeProp = FieldComponent.props?.valueType as any
        expect(valueTypeProp).toBeDefined()
        expect(valueTypeProp.default).toBe(valueType)
      }),
      { numRuns: 100 },
    )
  })
})
