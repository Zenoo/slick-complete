/** SlickCompleteItem Class used to handle the SlickComplete module's predictions */
class SlickCompleteItem{

    /**
     * Creates an instance of SlickCompleteItem
     * @param {String|Number} id Item's ID
     * @param {String} text      Text matching the user's input
     * @param {String} name      Item's locale name
     * @param {String} icon      Item's icon URL
     */
    constructor(id,text,name,icon){
        this.id = id;
        this.text = text;
        this.name = name;
        this.icon = icon;
    }
}

/** SlickComplete Class used to handle the SlickComplete module */
class SlickComplete{

    /**
     * Creates an instance of SlickComplete
     * and checks for invalid parameters
     * @param {(Element|String)} target           The input targeted by the SlickComplete module
     * @param {Object} [parameters]               Additional optional parameters
     * @param {Boolean} [parameters.icon=false]   Set to `true` to enable item icons    
     * @param {String} [parameters.lang=en]       Language to be used while displaying predictions
     * @param {Object[]} parameters.items         Items to complete from
     * @param {String|Number} parameters.items.id Item unique identifier
     * @param {Object} parameters.items.name      Set this Object's keys to the languages you want to support and their values to the corresponding translation
     * @param {String[]} parameters.items.aliases Aliases to search through for a single item
     * @param {String} parameters.items.icon      Item's icon URL
     */
    constructor(target, parameters = {icon: false, lang: 'en'}){
        /** @private */
        this._input = target instanceof Element ? target : document.querySelector(target);

        //Errors checking
        if(!this._input) throw new Error('SlickComplete: '+(typeof target == 'string' ? 'The selector `'+target+'` didn\'t match any element.' : 'The element you provided was undefined'));
        if(this._input.classList.contains('slick-complete-input')) throw new Error('SlickComplete: The element has already been initialized.');

        /** @private */
        this._onSelect = [];
        /** @private */
        this._onPredict = [];

        /** @private */
        this._parameters = parameters;

        this.value = '';

        if(typeof this._parameters.lang === 'undefined') this._parameters.lang = 'en';
        if(typeof this._parameters.icon === 'undefined') this._parameters.icon = false;

        if(this._parameters.items){
            this._parameters.items = this._parameters.items.map(item => {
                item.searchTerms = item.aliases.map(s => s.toLowerCase());
                for(let lang in item.name) item.searchTerms.push(item.name[lang].toLowerCase());
                return item;
            });
        }

        this._build();
        this._listen();
    }

    /**
     * Builds the SlickComplete DOM Tree around the element
     * @private
     */
    _build(){
        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('slick-complete');
        this._input.parentNode.insertBefore(this._wrapper, this._input);

        let border = document.createElement('div');
        border.classList.add('slick-complete-border');
        this._wrapper.appendChild(border);

        if(this._parameters.icon){
            this._wrapper.classList.add('slick-complete-icon-enabled');

            let iconWrapper = document.createElement('aside');
            iconWrapper.classList.add('slick-complete-icon');
            iconWrapper.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8S12.4 0 8 0zM9.2 13H6.9v-1.9h2.4V13zM11.5 7.3c-0.2 0.2-0.6 0.6-1.2 0.9l-0.6 0.4c-0.3 0.2-0.5 0.4-0.6 0.7 -0.1 0.2-0.1 0.4-0.1 0.8H6.9C7 9.4 7.1 8.9 7.2 8.6c0.1-0.3 0.5-0.6 1.1-1L8.8 7.2l0.5-0.4c0.2-0.2 0.3-0.5 0.3-0.8 0-0.3-0.1-0.6-0.4-0.9 -0.2-0.3-0.7-0.4-1.3-0.4 -0.6 0-1 0.2-1.3 0.5C6.4 5.5 6.3 5.9 6.3 6.2H4c0.1-1.3 0.6-2.2 1.6-2.7C6.2 3.2 7 3 7.9 3c1.2 0 2.2 0.2 3 0.7C11.6 4.2 12 4.9 12 5.9 12 6.5 11.8 6.9 11.5 7.3z" fill="#030104"/></svg>';

            this._icon = iconWrapper.getElementsByTagName('svg')[0];

            border.appendChild(iconWrapper);
        }

        this._prediction = document.createElement('input');
        this._prediction.classList.add('slick-complete-prediction');
        border.appendChild(this._prediction);

        this._input.classList.add('slick-complete-input');
        this._input = border.appendChild(this._input);

        this._validate = document.createElement('aside');
        this._validate.classList.add('slick-complete-validate');
        this._validate.innerHTML = '<svg enable-background="new 0 0 26 26" version="1.1" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="m0.3 14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4 0l0.1 0.1 5.5 5.9c0.2 0.2 0.5 0.2 0.7 0l13.4-13.9h0.1v-8.8818e-16c0.4-0.4 1-0.4 1.4 0l1.4 1.4c0.4 0.4 0.4 1 0 1.4l-16 16.6c-0.2 0.2-0.4 0.3-0.7 0.3s-0.5-0.1-0.7-0.3l-7.8-8.4-0.2-0.3z"/></svg>';
        border.appendChild(this._validate);
    }

    /**
     * Creates event listeners
     * @private
     */
    _listen(){
        //PREDICTIONS
        this._input.addEventListener('input',() => {
            if(this._input.value.length){
                let closestMatch = this.find(this._input.value);
                if(closestMatch){
                    if(closestMatch.text != closestMatch.name.toLowerCase()) this._prediction.value = closestMatch.text + ' (' + closestMatch.name + ')';
                    else this._prediction.value = closestMatch.text;
                    this._input.value = this._input.value.toLowerCase();
                    this._prediction.setAttribute('data-item-id', closestMatch.id);
                    if(this._parameters.icon) this._icon.innerHTML = '<image xlink:href="'+closestMatch.icon+'"/>';

                    //onPredict callbacks
                    for(let prediction of this._onPredict) prediction.call(this,this._input.value,this._parameters.items.find(e => e.id == closestMatch.id));
                }else{
                    this._prediction.value = this._input.value;
                    this._prediction.setAttribute('data-item-id', '');
                    if(this._parameters.icon) this._icon.innerHTML = '<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8S12.4 0 8 0zM9.2 13H6.9v-1.9h2.4V13zM11.5 7.3c-0.2 0.2-0.6 0.6-1.2 0.9l-0.6 0.4c-0.3 0.2-0.5 0.4-0.6 0.7 -0.1 0.2-0.1 0.4-0.1 0.8H6.9C7 9.4 7.1 8.9 7.2 8.6c0.1-0.3 0.5-0.6 1.1-1L8.8 7.2l0.5-0.4c0.2-0.2 0.3-0.5 0.3-0.8 0-0.3-0.1-0.6-0.4-0.9 -0.2-0.3-0.7-0.4-1.3-0.4 -0.6 0-1 0.2-1.3 0.5C6.4 5.5 6.3 5.9 6.3 6.2H4c0.1-1.3 0.6-2.2 1.6-2.7C6.2 3.2 7 3 7.9 3c1.2 0 2.2 0.2 3 0.7C11.6 4.2 12 4.9 12 5.9 12 6.5 11.8 6.9 11.5 7.3z" fill="#030104"/>';
                }
            }else{
                this._prediction.value = '';
                this._prediction.setAttribute('data-item-id', '');
                if(this._parameters.icon) this._icon.innerHTML = '<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8S12.4 0 8 0zM9.2 13H6.9v-1.9h2.4V13zM11.5 7.3c-0.2 0.2-0.6 0.6-1.2 0.9l-0.6 0.4c-0.3 0.2-0.5 0.4-0.6 0.7 -0.1 0.2-0.1 0.4-0.1 0.8H6.9C7 9.4 7.1 8.9 7.2 8.6c0.1-0.3 0.5-0.6 1.1-1L8.8 7.2l0.5-0.4c0.2-0.2 0.3-0.5 0.3-0.8 0-0.3-0.1-0.6-0.4-0.9 -0.2-0.3-0.7-0.4-1.3-0.4 -0.6 0-1 0.2-1.3 0.5C6.4 5.5 6.3 5.9 6.3 6.2H4c0.1-1.3 0.6-2.2 1.6-2.7C6.2 3.2 7 3 7.9 3c1.2 0 2.2 0.2 3 0.7C11.6 4.2 12 4.9 12 5.9 12 6.5 11.8 6.9 11.5 7.3z" fill="#030104"/>';
            }
        });

        //VALIDATION
        const validateItem = () => {
            if(this._prediction.getAttribute('data-item-id').length){
                this._input.value = this._prediction.value;
                this._input.blur();
                this.value = this._prediction.getAttribute('data-item-id');

                //onSelect callbacks
                for(let selection of this._onSelect) selection.call(this,this._parameters.items.find(e => e.id == this._prediction.getAttribute('data-item-id')));
            }
        }

        this._input.addEventListener('keyup', e => {
            if (e.which == 13 || e.keyCode == 13){
                validateItem();
            }
        });

        this._validate.addEventListener('click',() => {
            validateItem();
        });

        //DESIGN
        this._input.addEventListener('focus',() => {
            this._wrapper.classList.add('focused');
        });

        this._input.addEventListener('blur',() => {
            this._wrapper.classList.remove('focused');
        });
    }

    /**
     * Finds the matching item for the user's query
     * @param {String} value        String to search
     * @returns {SlickCompleteItem} The matching item
     */
    find(value){
        let search = value.toLowerCase();
        if(!this._parameters.items) throw new Error('SlickComplete: There are no items to search through. Add some with the `items` property of the options parameter or with the `setItems` method');
        let matchingItem = this._parameters.items.filter(e => e.searchTerms.some(s => s.startsWith(search)))[0];
        if(matchingItem){
            return new SlickCompleteItem(
                matchingItem.id,
                matchingItem.searchTerms.filter(s => s.startsWith(search))[0],
                matchingItem.name[this._parameters.lang],
                matchingItem.icon
            );
        }else{
            return null;
        }
    }

    /**
     * Function called after a selection.
     * Using <code>this</code> inside it will return the current {@link SlickComplete}
     *
     * @callback onSelectCallback
     * @param {SlickCompleteItem} item The selected item
     */

    /**
     * Adds a callback to be used when the user selects an item
     * @param {onSelectCallback} callback Function to call after the user's selection
     * @returns {SlickComplete}   The current {@link SlickComplete}
     */
    onSelect(callback){
        this._onSelect.push(callback);
        return this;
    }

    /**
     * Removes every callback previously added with {@link SlickComplete#onSelect}
     * @returns {SlickComplete} The current {@link SlickComplete}
     */
    offSelect(){
        this._onSelect = [];
        return this;
    }

    /**
     * Function called after a selection.
     * Using <code>this</code> inside it will return the current {@link SlickComplete}
     *
     * @callback onPredictCallback
     * @param {String} value The user's input
     * @param {SlickCompleteItem} item The predicted item
     */

    /**
     * Adds a callback to be used when a precition is displayed
     * @param {onPredictCallback} callback Function to call after a prediction
     * @returns {SlickComplete} The current {@link SlickComplete}
     */
    onPredict(callback){
        this._onPredict.push(callback);
        return this;
    }

    /**
     * Removes every callback previously added with {@link SlickComplete#onPredict}
     * @returns {SlickComplete} The current {@link SlickComplete}
     */
    offPredict(){
        this._onPredict = [];
        return this;
    }

    /**
     * Refreshes the input's display
     * @returns {SlickComplete} The current {@link SlickComplete}
     */
    refresh(){
        let event = new CustomEvent("input");
        this._input.dispatchEvent(event);
        return this;
    }

    /**
     * Manually select an item
     * @param {Object} itemId   The item to select
     * @returns {SlickComplete} The current {@link SlickComplete}
     */
    select(itemId){
        let item = this._parameters.items.find(e => e.id == itemId);

        this._prediction.value = item.name[this._parameters.lang];
        this._input.value = item.name[this._parameters.lang];
        this._prediction.setAttribute('data-item-id', item.id);
        if(this._parameters.icon) this._icon.innerHTML = '<image xlink:href="'+item.icon+'"/>';
        this._input.blur();

        //onSelect callbacks
        for(let selection of this._onSelect) selection.call(this,item);
        
        return this;
    }

    /**
     * Set the items to search through
     * @param {Object[]} items         Items to complete from
     * @param {String|Number} items.id Item unique identifier
     * @param {Object} items.name      Set this Object's keys to the languages you want to support and their values to the corresponding translation
     * @param {String[]} items.aliases Aliases to search through for a single item
     * @param {String} items.icon      Item's icon URL
     * @returns {SlickComplete}        The current {@link SlickComplete}
     */
    setItems(items){
        this._parameters.items = items.map(item => {
            item.searchTerms = item.aliases.map(s => s.toLowerCase());
            for(let lang in item.name) item.searchTerms.push(item.name[lang].toLowerCase());
            return item;
        });

        return this;
    }

    /**
     * Removes any SlickComplete mutation from the DOM
     */
    destroy(){
        this._wrapper.parentNode.insertBefore(this._input, this._wrapper);
        this._wrapper.remove();
        this._input.classList.remove('slick-complete-input');
        for(let prop in this) this[prop] = null;
    }
}