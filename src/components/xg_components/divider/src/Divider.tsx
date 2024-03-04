import { h, computed, defineComponent, type CSSProperties, type PropType } from "vue";
import Style from "../styles";
export const DividerProps = {
  titlePlacement: {
    type: String as PropType<"left" | "center" | "right">,
    default: "center"
  },
  dashed: Boolean,
  vertical: Boolean
} as const;

export default defineComponent({
  name: "Divider",
  props: DividerProps,
  setup(props) {
    return {};
  },
  render() {
    const { $slots, titlePlacement, vertical, dashed } = this;
    return (
      <div role="separator">
        {!vertical && $slots.default ? (
          <>
            <div>{this.$slots}1</div>
          </>
        ) : (
          <>
            <div class={["pointer"]}></div>
          </>
        )}
      </div>
    );
  }
});
