# System-Wide Input Components

## PhoneInput Component

A standardized phone input component with automatic formatting and validation for 10-digit US phone numbers.

### Features

- Automatic formatting as user types: `(555) 123-4567`
- Real-time validation for exactly 10 digits
- Visual feedback (red border for errors, green for valid)
- Error messages for validation feedback
- Success indicator for valid phone numbers

### Usage

```tsx
import { PhoneInput } from "@/components/ui/phone-input";

function MyForm() {
  const [phone, setPhone] = useState("");

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <PhoneInput
        id="phone"
        value={phone}
        onChange={(value) => setPhone(value)}
        required // Optional: makes phone required
      />
    </div>
  );
}
```

### Props

- `value`: string - The current phone value
- `onChange`: (value: string) => void - Called when phone changes
- `required`: boolean - Whether phone is required (default: false)
- `disabled`: boolean - Whether input is disabled
- `placeholder`: string - Custom placeholder text
- `className`: string - Additional CSS classes
- `id`, `name`: string - Form identifiers

### Validation Hook

```tsx
import { usePhoneValidation } from "@/components/ui/phone-input";

function MyComponent() {
  const [phone, setPhone] = useState("");
  const { isValid, error, formatPhoneNumber, digitsCount } = usePhoneValidation(
    phone,
    true,
  );

  // isValid: boolean
  // error: string
  // formatPhoneNumber: (phone: string) => string
  // digitsCount: number
}
```

## StateSelect Component

A searchable dropdown for selecting US states with two-letter abbreviations.

### Features

- Searchable dropdown with all 50 US states + DC
- Shows both abbreviation (e.g., "CA") and full name (e.g., "California")
- Filter/search functionality for quick selection
- Keyboard navigation support
- Consistent with system design

### Usage

```tsx
import { StateSelect } from "@/components/ui/state-select";

function MyForm() {
  const [state, setState] = useState("");

  return (
    <div className="space-y-2">
      <Label htmlFor="state">State</Label>
      <StateSelect
        id="state"
        value={state}
        onValueChange={(value) => setState(value)}
        placeholder="Select state..."
      />
    </div>
  );
}
```

### Simple Version (No Search)

For simpler use cases without search functionality:

```tsx
import { StateSelectSimple } from "@/components/ui/state-select";

<StateSelectSimple value={state} onValueChange={setState} />;
```

### Props

- `value`: string - The current state abbreviation (e.g., "CA")
- `onValueChange`: (value: string) => void - Called when state changes
- `placeholder`: string - Placeholder text (default: "Select state...")
- `disabled`: boolean - Whether select is disabled
- `className`: string - Additional CSS classes
- `id`, `name`: string - Form identifiers

### Available States

All US states plus District of Columbia are included:

- Returns two-letter abbreviation (e.g., "CA", "NY", "TX")
- Displays as "CA - California" in dropdown
- Includes DC for District of Columbia

## Implementation Notes

### System-Wide Usage

These components should be used throughout the application wherever:

- **PhoneInput**: Any phone number input field
- **StateSelect**: Any state selection field

### Existing Updates

The following components have been updated to use these new components:

- Profile page phone input
- User management phone input
- Settings contact phone input
- Project creation phone input
- SignUp form phone inputs
- Metadata settings state input

### Validation Standards

- **Phone**: Exactly 10 digits, formatted as (XXX) XXX-XXXX
- **State**: Two-letter US state abbreviations (AL, AK, AZ, etc.)

### Styling

Both components inherit the application's design system:

- Consistent with existing UI components
- Proper error states and validation feedback
- Responsive design
- Accessibility support

### Dependencies

- PhoneInput: Built on `@/components/ui/input`
- StateSelect: Built on `@/components/ui/popover`, `@/components/ui/command`, and `cmdk`
