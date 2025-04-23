---
id: toast-handlers
title: Toast Handlers Examples
hide_title: false
sidebar_label: Toast Handler Examples
slug: /api/toast-toast-handlers
---
# Usage Examples

## Basic Usage with Individual Handlers

```jsx
import { toast, DismissReason } from '@backpackapp-io/react-native-toast';

// Simple toast with individual handlers
toast('Operation completed', {
  onShow: (toast) => {
    console.log(`Toast ${toast.id} appeared`);
    analytics.track('toast_shown', { id: toast.id });
  },
  onHide: (toast, reason) => {
    console.log(`Toast ${toast.id} disappeared because: ${reason}`);
    analytics.track('toast_hidden', { id: toast.id, reason });
  },
  onPress: (toast) => {
    console.log(`Toast ${toast.id} was pressed`);
    navigation.navigate('Details');
  }
});
```

## Handling Different Dismiss Reasons

```jsx
toast.success('Item added to cart', {
  onHide: (toast, reason) => {
    switch (reason) {
      case DismissReason.TIMEOUT:
        // User didn't interact with the toast
        console.log('User didn\'t interact with cart notification');
        break;

      case DismissReason.SWIPE:
        // User actively dismissed the toast
        console.log('User dismissed cart notification');
        break;

      case DismissReason.TAP:
        // User tapped the toast
        console.log('User tapped cart notification');
        break;

      case DismissReason.PROGRAMMATIC:
        // Toast was dismissed by code
        console.log('Cart notification was programmatically dismissed');
        break;
    }
  }
});
```

## Accessing Component State in Handlers

```jsx
function ProductScreen() {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigation = useNavigation();

  const handleAddToCart = (productId) => {
    // Add product to cart
    addToCart(productId, quantity);

    // Show toast with access to component state
    toast.success('Added to cart', {
      onPress: (toast) => {
        // Access component state and navigation here
        navigation.navigate('Cart', {
          recentlyAdded: productId,
          quantity
        });
      },
      duration: 3000
    });
  };

  return (
    <View>
      <Text>Quantity: {quantity}</Text>
      <Button
        title="+"
        onPress={() => setQuantity(q => q + 1)}
      />
      <Button
        title="Add to Cart"
        onPress={() => handleAddToCart('product-123')}
      />
    </View>
  );
}
```

## Toast with Undo Functionality

```jsx
function EmailList() {
  const { deleteEmail, restoreEmail } = useEmails();

  const handleDelete = (emailId) => {
    // Delete the email
    deleteEmail(emailId);

    // Show toast with undo button
    toast('Email deleted', {
      duration: 5000,
      onPress: (toast) => {
        // Restore the email when toast is pressed
        restoreEmail(emailId);

        // Dismiss the toast
        toast.dismiss(toast.id);

        // Show confirmation
        toast.success('Email restored');
      },
      // Can also check dismiss reason
      onHide: (toast, reason) => {
        if (reason !== DismissReason.TAP) {
          // If toast wasn't tapped (undo wasn't clicked),
          // permanently delete the email
          console.log('Email permanently deleted');
        }
      }
    });
  };

  return (
    <FlatList
      data={emails}
      renderItem={({ item }) => (
        <EmailItem
          email={item}
          onDelete={() => handleDelete(item.id)}
        />
      )}
    />
  );
}
```

## Programmatically Dismissing with Reason

```jsx
function UploadScreen() {
  const [uploadId, setUploadId] = useState(null);

  const startUpload = async () => {
    // Show loading toast
    const id = toast.loading('Uploading file...');
    setUploadId(id);

    try {
      await uploadFile();
      // Success - update toast
      toast.success('Upload complete!', { id });
    } catch (error) {
      // Error - dismiss with custom reason
      toast.dismiss(id, DismissReason.PROGRAMMATIC);

      // Show error toast
      toast.error('Upload failed');
    }
  };

  const cancelUpload = () => {
    if (uploadId) {
      // Dismiss with custom reason
      toast.dismiss(uploadId, DismissReason.PROGRAMMATIC);
      toast('Upload cancelled');
    }
  };

  return (
    <View>
      <Button title="Start Upload" onPress={startUpload} />
      <Button title="Cancel" onPress={cancelUpload} />
    </View>
  );
}
```
