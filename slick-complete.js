class SlickCompleteItem{
    constructor(id,name,picture,aliases){
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.aliases = aliases;
    }
}

/** SlickComplete Class used to handle the SlickComplete module */
class SlickComplete{

    //TODO: Define parameter's attributes (see JSDoc's doc)
    /**
     * Creates an instance of SlickComplete
     * and checks for invalid parameters
     * @param {(Element|String)} target The input targeted by the SlickComplete module
     * @param {Object} parameters       Additional optional parameters
     */
    constructor(target, parameters){
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
        this._parameters = parameters

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

        this._prediction = document.createElement('input');
        this._prediction.classList.add('slick-complete-prediction');
        this._wrapper.appendChild(this._prediction);

        this._input.classList.add('slick-complete-input');
        this._input = this._wrapper.appendChild(this._input);
    }

    /**
     * Creates event listeners
     * @private
     */
    _listen(){
        this._input.addEventListener('input',() => {
            //DO PREDICTION HERE
            this._prediction.value = this._input.value + 'test';

            //onPredict callbacks
            for(let prediction of this._onPredict) prediction.call(this,'a','b');
        });
    }

    /**
     * Adds a callback to be used when the user selects an item
     * @param {Function} callback Function to call after the user's selection
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
     * Adds a callback to be used when a precition is displayed
     * @param {Function} callback Function to call after a prediction
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
        return this;
    }

    /**
     * Manually select an item
     * @param {Object} item     The item to select
     * @returns {SlickComplete} The current {@link SlickComplete}
     */
    select(item){
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