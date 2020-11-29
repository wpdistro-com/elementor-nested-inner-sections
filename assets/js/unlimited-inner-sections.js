jQuery(window).on("elementor:init", function ($) {
    if (!window.elementor)
        return;

    elementor.hooks.addFilter('element/view', function (elementView, element) {
        if (element.get('elType') === 'column') {
            return elementView.extend({
                isDroppingAllowed: function() {
                    var elementView = elementor.channels.panelElements.request( 'element:selected' );

                    if (!elementView)
                        return false;

                    var elType = elementView.model.get('elType');

                    return 'widget' === elType || 'section' === elType;
                },
                addElementFromPanel: function (options) {
                    if (elementor.channels.panelElements.request('element:selected').model.get('elType') !== 'section')
                        return elementView.prototype.addElementFromPanel.apply(this, options);

                    var getColumn = function () {
                        return {
                            id: elementor.helpers.getUniqueID(),
                            elType: 'column',
                            isInner: true,
                            settings: {
                                _column_size: 100
                            },
                            elements: []
                        };
                    };

                    insertSection(elementView.prototype.getContainer.apply(this, arguments).view);
                }
            });
        }

        return elementView;
    });

    elementor.hooks.addFilter('elements/column/contextMenuGroups', contextMenuAdd)
});

function contextMenuAdd(groups, element) {
    var clipboard_index = groups.findIndex(function (item) {
        return 'addNew' === item.name;
    });

    groups[clipboard_index].actions.push({
        name: 'wpde-unlimited-sections',
        title: 'Add Inner Section',
        icon: 'eicon-plus-circle',
        callback: function () {
            insertSection(element.getContainer().view);
        },
        isEnabled: function () {
            return true;
        }
    });

    return groups;
}

function insertSection(elementView) {
    if (elementView.getElementType() !== 'column')
        return;

    var getColumn = function () {
        return {
            id: elementor.helpers.getUniqueID(),
            elType: 'column',
            isInner: true,
            settings: {
                _column_size: 100
            },
            elements: []
        };
    };

    elementView.addElement({
        elType: 'section',
        isInner: true,
        elements: [getColumn(), getColumn()]
    });
}
