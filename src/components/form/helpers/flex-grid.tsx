/**
 * Flex-based Grid System
 * A clean, reusable 24-column grid system using flexbox
 * Uses gap for spacing and inline styles for span/offset
 */

import type { CSSProperties, PropType } from "vue";
import { computed, defineComponent } from "vue";
import "./flex-grid.less";

export interface FlexRowProps {
  /** Gap between columns in pixels */
  gap?: number;
  /** Total number of columns (default: 24) */
  columns?: number;
  /** Whether to wrap items */
  wrap?: boolean;
  /** Align items */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify content */
  justify?: "start" | "center" | "end" | "between" | "around";
}

export interface FlexColProps {
  /** Number of columns to span (1-24) */
  span?: number;
  /** Number of columns to offset */
  offset?: number;
  /** Whether this column is hidden */
  hidden?: boolean;
}

/**
 * FlexRow - Flex container for grid layout
 */
export const FlexRow = defineComponent({
  name: "FlexRow",
  props: {
    gap: {
      type: Number,
      default: 24,
    },
    columns: {
      type: Number,
      default: 24,
    },
    wrap: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String as PropType<FlexRowProps["align"]>,
      default: "stretch",
    },
    justify: {
      type: String as PropType<FlexRowProps["justify"]>,
      default: "start",
    },
  },
  setup(props, { slots }) {
    const justifyMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "space-between",
      around: "space-around",
    };

    const alignMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      stretch: "stretch",
    };

    const rowStyle = computed<CSSProperties>(() => ({
      display: "flex",
      flexWrap: props.wrap ? "wrap" : "nowrap",
      gap: `${props.gap}px`,
      alignItems: alignMap[props.align || "stretch"],
      justifyContent: justifyMap[props.justify || "start"],
      width: "100%",
    }));

    return () => (
      <div
        class="pro-flex-row"
        style={rowStyle.value}
        data-columns={props.columns}
      >
        {slots.default?.()}
      </div>
    );
  },
});

/**
 * FlexCol - Flex item for grid layout
 */
export const FlexCol = defineComponent({
  name: "FlexCol",
  props: {
    span: {
      type: Number,
      default: 1,
    },
    offset: {
      type: Number,
      default: 0,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    // Calculate width based on span and parent's columns (default 24)
    // Using CSS calc with custom property for flexibility
    const colStyle = computed<CSSProperties>(() => {
      if (props.hidden) {
        return { display: "none" };
      }

      const columns = 24; // Default to 24 columns
      const spanPercent = (props.span / columns) * 100;

      // Calculate width considering gap
      // Since we're using gap, we need to subtract gap space from width
      // For a row with N items, there are N-1 gaps
      // Each item needs to account for its share of gap space
      const style: CSSProperties = {
        // Use flex-basis with calc to handle gap properly
        // The formula accounts for gap by subtracting fractional gap space
        flexBasis: `calc(${spanPercent}% - var(--flex-row-gap, 24px) * ${
          (columns - props.span) / columns
        })`,
        flexGrow: 0,
        flexShrink: 0,
        maxWidth: `${spanPercent}%`,
        boxSizing: "border-box",
      };

      // Handle offset using margin-left
      if (props.offset > 0) {
        const offsetPercent = (props.offset / columns) * 100;
        style.marginLeft = `calc(${offsetPercent}% + var(--flex-row-gap, 24px) * ${
          props.offset / columns
        })`;
      }

      return style;
    });

    return () => (
      <div class="pro-flex-col" style={colStyle.value}>
        {slots.default?.()}
      </div>
    );
  },
});

export default { FlexRow, FlexCol };
