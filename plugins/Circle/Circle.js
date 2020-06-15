
import React from 'react';
import i18n from 'i18next';
import Poly from "./Poly";
import { generateCustomColors } from "../../common/themes/themeLoader";

export function Circle() {
    return {
        getConfig: function(state) {
            return {
            name: 'Circle',
            displayName: i18n.t('Circle.PluginName'),
            category: "shapes",
            flavor: "react",
            needsConfigModal: false,
            needsTextEdition: false,
            initialWidth: '120%',
            initialHeight: "auto",
            initialWidthSlide: '60%',
            initialHeightSlide: 'auto',
            icon: 'star',
          };
        },

        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                          circlestyle: {
                              __name: i18n.t('Circle.circlestyle'),
                              icon: 'build',
                              buttons: {
                                  borderColor: {
                                    __name: Ediphy.i18n.t('Circle.borderColor'),
                                    type: 'custom_color_plugin',
                                    value: state.borderColor
                                  },
                                  circlestrokeWidth: {
                                      __name: Ediphy.i18n.t("Circle.circlestrokeWidth"),
                                      type: "number",
                                      value: state.circlestrokeWidth,
                                      min: 1,
                                      max: 10,
                                      },
                                  circleBorderStyle: {
                                      __name: Ediphy.i18n.t('Circle.circleBorderStyle'),
                                      type: 'select',
                                      value: state.circleBorderStyle,
                                      options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                  },
                                  shapeColor: {
                                      __name: Ediphy.i18n.t('Circle.shapeColor'),
                                      type: 'custom_color_plugin',
                                      value: state.shapeColor,
                                  },
                                  circleOpacity: {
                                      __name:Ediphy.i18n.t("Circle.circleOpacity"),
                                      type: "range",
                                      value: state.circleOpacity,
                                      min: 0,
                                      max: 1,
                                      step: 0.01,
                                  },
                              },
                          },
                        style: {
                        __name: i18n.t('Circle.style'),
                        icon: 'palette',
                        buttons: {
                          padding: {
                              __name: Ediphy.i18n.t('Circle.padding'),
                              type: 'number',
                              value: 10,
                              min: 0,
                              max: 100,
                          },
                          backgroundColor: {
                              __name: Ediphy.i18n.t('Circle.backgroundColor'),
                              type: 'color',
                              value: 'transparent',
                          },
                          borderWidth: {
                              __name: Ediphy.i18n.t('Circle.border_size'),
                              type: 'number',
                              value: 0,
                              min: 0,
                              max: 10,
                          },
                          borderStyle: {
                              __name: Ediphy.i18n.t('Circle.border_style'),
                              type: 'select',
                              value: 'solid',
                              options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                          },
                          borderColor: {
                              __name: Ediphy.i18n.t('Circle.border_color'),
                              type: 'color',
                              value: '#dbdbdb',
                          },
                          borderRadius: {
                              __name: Ediphy.i18n.t('Circle.radius'),
                              type: 'number',
                              value: 0,
                              min: 0,
                              max: 50,
                          },
                          opacity: {
                              __name: Ediphy.i18n.t('Circle.opacity'),
                              type: 'range',
                              value: 1,
                              min: 0,
                              max: 1,
                              step: 0.01,
                          },
                        },
                      },
                },
            },
          };
        },
        getInitialState: function() {
          return {
              nSides: 4,
              borderColor: { color: document.documentElement.style.getPropertyValue('--themeColor1'), custom: false },
              circlestrokeWidth: 1,
              circleBorderStyle:"solid",
              shapeColor: { color: 'transparent', custom: false },
              circleOpacity:1,

            };
        },
        getRenderTemplate: function(state,props) {
            return(
            <Poly sides={state.nSides} size={40} cx={0} cy={0} r={70}
             circlestrokeWidth={state.circlestrokeWidth} borderColor={state.borderColor.color}
             shapeColor={state.shapeColor.color} circleBorderStyle={state.circleBorderStyle}
             circleOpacity={state.circleOpacity}/>
        );
      },
  };
}
