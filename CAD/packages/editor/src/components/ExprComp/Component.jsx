import { defineComponent, resolveComponent, toRef, ref, watch } from "vue";
import { isExprString, isColorString} from '@/lib/utils'
import getSlot from '@form-create/utils/lib/slot';
const NAME = "exprInput";
import emitter from '@/lib/mitt';
import { isNumber } from "lodash";
export default defineComponent({
  name: NAME,
  inheritAttrs: false,
  props: {
    formCreateInject: Object,
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    childType: String,
    onlyExprInput: { 
      type: Boolean,
      default: false
    },
    hideExprButton: { 
      type: Boolean,
      default: false
    },
    disableAutoSwitchComp: { 
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(props, _) {
    const options = toRef(props.formCreateInject, "options", []);
    const value = toRef(props, "modelValue");
    const controlValue = ref();
    const exprValue = ref();
    const isExpr = ref(false);
    let val = value.value || '';
    if (props.disableAutoSwitchComp ) {
      if (val === undefined || val === "") {
        controlValue.value = value.value;
      } else if (props.childType == "ColorPicker" && isColorString(val)) {
        controlValue.value = value.value;
      } else if (props.childType == "InputNumber" && isNumber(val)) {
        controlValue.value = value.value;
      } else {
        isExpr.value = true;
        exprValue.value = value.value;
      }
    } else {
      if (isExprString(val) || props.onlyExprInput) {
        isExpr.value = true;
        exprValue.value = value.value;
      } else {
        controlValue.value = value.value;
      }
    }
   
    const _options = () => {
      return Array.isArray(options.value) ? options.value : [];
    };
    const setIsExpr = (b) => {
      isExpr.value = b
      onInput(b ? exprValue.value : controlValue.value)
    }
    const getIsExpr = () => {
      return isExpr.value
    }
    watch(value, e => {
      if (props.disableAutoSwitchComp ) return;
      if (!e) return;
      if (isExprString(e) || props.onlyExprInput) {
        isExpr.value = true;
      } else {
        isExpr.value = false;
      }
      if (getIsExpr()) {
        exprValue.value =  e
      } else {
        controlValue.value = e
      }
    })
    const onInput = n => {
      if (props.disableAutoSwitchComp ) {
        if (val === undefined) {
          controlValue.value = n
        } else if (props.childType == "ColorPicker" && isColorString(val)) {
          controlValue.value = n
        } else if (props.childType == "InputNumber" && isNumber(val)) {
          controlValue.value = n
        } else {
          exprValue.value =  n
        }
        
      }  else {
        if (getIsExpr()) {
          exprValue.value =  n
        } else {
          controlValue.value = n
        }
      }
      _.emit("update:modelValue", n);
    }

    emitter.on("exprDialogValue", val => {
      exprValue.value = val;
      if (getIsExpr()) {
        _.emit("update:modelValue", val);
      }
    });

    const isOnlyExprInput = () =>  props.onlyExprInput
    const isHideExprButton = () =>  props.hideExprButton
    return {
      options: _options,
      value,
      exprValue,
      controlValue,
      isExpr,
      getIsExpr,
      setIsExpr,
      onInput,
      isOnlyExprInput,
      isHideExprButton
    };
  },
  render() {
    let compType = this.childType;
    if (compType.charAt(0) != 'N' && compType.indexOf("-") == -1) {
        compType = 'N' + compType.charAt(0).toUpperCase() + compType.slice(1);
    }
    const Type = resolveComponent(compType);
    const slots = {};
    slots.trigger = () => <n-button style="width:30px" size="small" onClick={() => this.setIsExpr(true)}>fx</n-button>
    const exprSlots = {};
    exprSlots.trigger = () => <n-button style="width:100%" size="tiny" onClick={() => this.setIsExpr(false)}>&lt;-</n-button>
    const exprMoreSlots = {};
    exprMoreSlots.trigger = () => <n-button style="width:100%;margin-top:5px" size="tiny" onClick={() => emitter.emit("showExprDialog")}>...</n-button>
    return (!this.getIsExpr() ? 
      <div style="display:flex;width:100%" >
        <div style="flex:1">
          <Type
            {...this.$attrs}
            value={this.controlValue}
            v-slots={getSlot(this.$slots, ["default"])}
            onUpdate:value={this.onInput}
          >
            {this.$slots.default?.()}
          </Type>
        </div>
       {!this.isOnlyExprInput() ? <n-tooltip v-slots={slots}>
          切换至表达式输入
        </n-tooltip> : null}
      </div>
      :
      <div style="display:flex;width:100%" >
        <div style="flex:1">
          <NInput
            type="textarea"
            size="small"
            autosize={{
              minRows: 3,
              maxRows: 10
            }}
            placeholder=''
            value={this.exprValue}
            onUpdate:value={this.onInput}
          >
            {this.$slots.default?.()}
          </NInput>
        </div>
        <div style="width:30px" >
        {!this.isOnlyExprInput() ?  <n-tooltip v-slots={exprSlots}>
            切换至值输入
          </n-tooltip> : null}
        {!this.isHideExprButton() ?  <n-tooltip v-slots={exprMoreSlots}>
            表达式语法
          </n-tooltip> : null}
        </div>
      </div>
  )}
});
