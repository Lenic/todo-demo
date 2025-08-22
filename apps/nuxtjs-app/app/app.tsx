import { defineComponent } from 'vue';
import { Button } from '~~/components/ui/button';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div>
        <div>Route Announcer</div>
        <div>Welcome to Nuxt</div>
        <Button>Click me</Button>
      </div>
    );
  },
});
