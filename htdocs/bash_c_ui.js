// -*- mode: javascript; coding: utf-8 -*-
//
// Copyright 2011 Andrej A Antonov <polymorphm@gmail.com>
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function() {
    'use strict'
    
    var html_ns = 'http://www.w3.org/1999/xhtml'
    
    function debug_log(value) {
        var pre = document.getElementById('debug_log')
        
        if(pre) {
            pre.appendChild(
                document.createElementNS(html_ns, 'hr')
            )
            pre.appendChild(
                document.createTextNode('⚠ Debug Log: ' + value)
            )
            pre.appendChild(
                document.createElementNS(html_ns, 'html:br')
            )
            pre.style.display = 'block'
        }
    }
    
    var func_tools = {
        args_array: function(raw_args) {
            var args = []
        
            for(var i = 0; i < raw_args.length; ++i) {
                args.push(raw_args[i])
            }
            
            return args
        },
        func_bind: function(func, this_arg) {
            var args = this.args_array(arguments).slice(2)
            
            if(func.bind) {
                // using built 'func.bind()'. this is more effective way
                
                var bound = func.bind.apply(func, [this_arg].concat(args))
                
                return bound
            } else {
                // using emulation  of 'func.bind()'. this is less effective way
                
                var self_module = this
                
                var bound = function() {
                    var func_args = args.concat(self_module.args_array(arguments))
                    var func_res = func.apply(this_arg, func_args)
                    
                    return func_res
                }
                
                return bound
            }
        },
        StopIteration: function() {},
        list_iterate: function(l, iter) {
            try {
                for(var i = 0; i < l.length; ++i) {
                    var v = l[i];
                    
                    iter(i, v)
                }
            } catch(e) {
                if(!(e instanceof this.StopIteration)) {
                    throw e
                }
            }
        },
        node_iterate: function(n, iter) {
            try {
                for(var in_n = n.firstChild;
                        in_n;
                        in_n = in_n.nextSibling) {
                    iter(in_n)
                }
            } catch(e) {
                if(!(e instanceof this.StopIteration)) {
                    throw e
                }
            }
        },
    }
    
    function head_params_iterate(params_name, params_ns, iter) {
        func_tools.node_iterate(document, function(in_root_node) {
            if(in_root_node.nodeType == Node.ELEMENT_NODE &&
                    in_root_node.localName == 'html' &&
                    in_root_node.namespaceURI == html_ns) {
                func_tools.node_iterate(in_root_node, function(in_html_node) {
                    if(in_html_node.nodeType == Node.ELEMENT_NODE &&
                            in_html_node.localName == 'head' &&
                            in_html_node.namespaceURI == html_ns) {
                        func_tools.node_iterate(in_html_node, function(in_head_node) {
                            if(in_head_node.nodeType == Node.ELEMENT_NODE &&
                                    in_head_node.localName == params_name &&
                                    in_head_node.namespaceURI == params_ns) {
                                iter(in_head_node)
                            }
                        })
                    }
                })
            }
        })
    }
    
    function create_h_box(left_elems, center_elem, right_elems) {
        var h_box = document.createElementNS(html_ns, 'div')
        
        h_box.style.display = 'table'
        h_box.style.width = '100%'
        h_box.style.height = '100%'
        
        var row = document.createElementNS(html_ns, 'div')
        
        row.style.display = 'table-row'
        
        func_tools.list_iterate(left_elems, function(i, elem) {
            var cell = document.createElementNS(html_ns, 'div')
            
            cell.style.display = 'table-cell'
            cell.appendChild(elem)
            row.appendChild(cell)
            h_box.appendChild(row)
        })
        
        var cell = document.createElementNS(html_ns, 'div')
        
        cell.style.display = 'table-cell'
        cell.style.width = '100%'
        cell.appendChild(center_elem)
        row.appendChild(cell)
        h_box.appendChild(row)
        
        func_tools.list_iterate(right_elems, function(i, elem) {
            var cell = document.createElementNS(html_ns, 'div')
            
            cell.style.display = 'table-cell'
            cell.appendChild(elem)
            row.appendChild(cell)
            h_box.appendChild(row)
        })
        
        return h_box
    }
    
    function shell_quote(str) {
        var result =
            '\'' + new String(str).replace('\'', '\'\\\'\'') + '\''
        
        return result
    }
    
    function create_v_box(top_elems, center_elem, bottom_elems) {
        var v_box = document.createElementNS(html_ns, 'div')
        
        v_box.style.display = 'table'
        v_box.style.width = '100%'
        v_box.style.height = '100%'
        
        func_tools.list_iterate(top_elems, function(i, elem) {
            var row = document.createElementNS(html_ns, 'div')
            
            row.style.display = 'table-row'
            
            var cell = document.createElementNS(html_ns, 'div')
            
            cell.style.display = 'table-cell'
            cell.appendChild(elem)
            row.appendChild(cell)
            v_box.appendChild(row)
        })
        
        var row = document.createElementNS(html_ns, 'div')
        
        row.style.display = 'table-row'
        
        var cell = document.createElementNS(html_ns, 'div')
        
        cell.style.display = 'table-cell'
        cell.style.height = '100%'
        cell.appendChild(center_elem)
        row.appendChild(cell)
        v_box.appendChild(row)
        
        func_tools.list_iterate(bottom_elems, function(i, elem) {
            var row = document.createElementNS(html_ns, 'div')
            
            row.style.display = 'table-row'
            
            var cell = document.createElementNS(html_ns, 'div')
            
            cell.style.display = 'table-cell'
            cell.appendChild(elem)
            row.appendChild(cell)
            v_box.appendChild(row)
        })
        
        return v_box
    }
    
    function BashCUi() {
        this._key = ''
        this._history = {}
    }
    
    BashCUi.prototype._create_title_node = function() {
        var title_node = document.createElementNS(html_ns, 'h1')
        
        title_node.style.margin = '0.5em'
        title_node.appendChild(
                document.createTextNode('bash -c <...> # Web Shell'))
        
        return title_node
    }
    
    BashCUi.prototype._create_enter_key_button = function() {
        var enter_key_button = document.createElementNS(html_ns, 'a')
        
        enter_key_button.href = '#'
        enter_key_button.appendChild(
                document.createTextNode('Enter Key...'))
        
        function perform(evt) {
            evt.preventDefault()
            
            var result = prompt(
                    'Enter Key:', this._key)
            if(result !== null) {
                this._key = result
            }
        }
        
        enter_key_button.addEventListener(
                'click', func_tools.func_bind(perform, this), false)
        
        return enter_key_button
    }
    
    BashCUi.prototype._create_clean_button = function() {
        var clean_button = document.createElementNS(html_ns, 'a')
        
        clean_button.href = '#'
        clean_button.appendChild(
                document.createTextNode('Clean History'))
        
        function perform(evt) {
            evt.preventDefault()
            
            while(this._history_node.length > 1) {
                this._history_node.remove(this._history_node.length - 2)
            }
            
            this._history = {}
        }
        
        clean_button.addEventListener(
                'click', func_tools.func_bind(perform, this), false)
        
        return clean_button
    }
    
    BashCUi.prototype._create_enter_cgi_bin_button = function() {
        var enter_cgi_bin_button = document.createElementNS(html_ns, 'a')
        
        enter_cgi_bin_button.href = '#'
        enter_cgi_bin_button.appendChild(
                document.createTextNode('Enter Other Cgi-Bin Script Url...'))
        
        function perform(evt) {
            evt.preventDefault()
            
            var result = prompt(
                    'Enter Other Cgi-Bin Script Url:', this._bash_c_cgi_bin_url)
            if(result !== null) {
                this._bash_c_cgi_bin_url = result
            }
        }
        
        enter_cgi_bin_button.addEventListener(
                'click', func_tools.func_bind(perform, this), false)
        
        return enter_cgi_bin_button
    }
    
    BashCUi.prototype._create_menu_node = function() {
        var menu_node = document.createElementNS(html_ns, 'div')
        
        menu_node.style.margin = '0.5em'
        
        var label_node = document.createElementNS(html_ns, 'div')
        
        label_node.appendChild(
                document.createTextNode('Menu:'))
        menu_node.appendChild(label_node)
        
        var buttons_node = document.createElementNS(html_ns, 'div')
        
        buttons_node.appendChild(
                document.createTextNode(':: '))
        buttons_node.appendChild(
                this._create_enter_key_button())
        buttons_node.appendChild(
                document.createTextNode(' :: '))
        buttons_node.appendChild(
                this._create_clean_button())
        buttons_node.appendChild(
                document.createTextNode(' :: '))
        buttons_node.appendChild(
                this._create_enter_cgi_bin_button())
        menu_node.appendChild(buttons_node)
        
        return menu_node
    }
    
    BashCUi.prototype._create_history_node = function() {
        var history_node = document.createElementNS(html_ns, 'select')
        
        history_node.multiple = true
        history_node.size = 2
        history_node.style.border = '0'
        history_node.style.width = '100%'
        history_node.style.height = '100%'
        
        var last_option_node = document.createElementNS(html_ns, 'option')
        last_option_node.text = '<END_OF_HISTORY>'
        last_option_node.value = '<END_OF_HISTORY>'
        last_option_node.selected = true
        history_node.add(last_option_node, null)
        
        function perform(evt) {
            for(var i = 0; i < this._history_node.length - 1; ++i) {
                if(this._history_node.options[i].selected) {
                    var full_cmd = this._history_node.options[i].value
                    var dir = this._history[full_cmd].dir
                    var cmd = this._history[full_cmd].cmd
                    
                    if(dir) {
                        this._dir_node.value = dir
                    } else {
                        this._dir_node.value = ''
                    }
                    
                    if(cmd) {
                        this._cmd_node.value = cmd
                    } else {
                        this._cmd_node.value = ''
                    }
                    
                    break
                }
            }
        }
        
        history_node.addEventListener(
                'change', func_tools.func_bind(perform, this), false)
        
        this._history_node = history_node
        this._last_option_node = last_option_node
    }
    
    BashCUi.prototype._update_history = function(dir, cmd, full_cmd) {
        this._history[full_cmd] = {
            dir: dir,
            cmd: cmd,
        }
        
        var option_node = document.createElementNS(html_ns, 'option')
        option_node.text = full_cmd
        option_node.value = full_cmd
        this._history_node.add(option_node, this._last_option_node)
        
        // TODO: scrolling...
    }
    
    BashCUi.prototype._create_dir_node = function() {
        var dir_node = document.createElementNS(html_ns, 'input')
        
        dir_node.type = 'text'
        dir_node.style.border = '0'
        dir_node.style.width = '100%'
        
        this._dir_node = dir_node
    }
    
    BashCUi.prototype._create_cmd_node = function() {
        var cmd_node = document.createElementNS(html_ns, 'input')
        
        cmd_node.type = 'text'
        cmd_node.style.border = '0'
        cmd_node.style.width = '100%'
        
        function perform(evt) {
            if(evt.keyCode == 13) {
                evt.preventDefault()
                
                var dir =  this._dir_node.value
                var cmd = this._cmd_node.value
                if(cmd) {
                    var full_cmd
                    
                    if(dir) {
                        full_cmd =
                                'cd ' + shell_quote(dir) +
                                ' && ' + cmd
                    } else {
                        full_cmd = cmd
                    }
                    
                    var exec_url =
                            this._bash_c_cgi_bin_url +
                            '/key/' + this._key + '?' +
                            encodeURIComponent(full_cmd)
                    
                    open(exec_url, '_blank')
                    
                    this._update_history(dir, cmd, full_cmd)
                    this._cmd_node.value = ''
                }
            }
        }
        
        cmd_node.addEventListener(
                'keypress', func_tools.func_bind(perform, this), false)
        
        this._cmd_node = cmd_node
    }
    
    BashCUi.prototype._create_root_node = function() {
        this._create_history_node()
        this._create_dir_node()
        this._create_cmd_node()
        
        var root_node = create_v_box(
            [
                this._create_title_node(),
                document.createElementNS(html_ns, 'hr'),
                this._create_menu_node(),
                document.createElementNS(html_ns, 'hr'),
                document.createTextNode('History:'),
            ],
            this._history_node,
            [
                document.createTextNode('Work Dir:'),
                this._dir_node,
                document.createTextNode('Command:'),
                this._cmd_node,
            ]
        )
        
        this._root_node = root_node
    }
    
    BashCUi.prototype.init = function(bash_c_cgi_bin_url) {
        this._bash_c_cgi_bin_url = bash_c_cgi_bin_url
        
        this._create_root_node()
    }
    
    function new_bash_c_ui(bash_c_cgi_bin_url) {
        var bash_c_ui = new BashCUi
        bash_c_ui.init(bash_c_cgi_bin_url)
        return bash_c_ui
    }
    
    BashCUi.prototype.show = function(target_id) {
        var target = document.getElementById(target_id)
        
        if(target && target.parentNode) {
            target.parentNode.replaceChild(this._root_node, target)
        }
    }
    
    function bash_c_bootstrap() {
        var script_params_ns = '/2011/02/19/bash_c_ui/params'
        var bash_c_cgi_bin_url = null
        
        head_params_iterate('bash_c_params', script_params_ns,
                function(node) {
                    func_tools.node_iterate(node, function(in_node) {
                        if(in_node.nodeType == Node.ELEMENT_NODE &&
                                in_node.localName == 'bash_c_cgi_bin_url' &&
                                in_node.namespaceURI == script_params_ns) {
                            bash_c_cgi_bin_url = in_node.getAttributeNS('', 'value')
                        } else if(in_node.nodeType == Node.ELEMENT_NODE &&
                                in_node.localName == 'bash_c_ui' &&
                                in_node.namespaceURI == script_params_ns) {
                            var target_id = in_node.getAttributeNS('', 'target_id')
                            
                            if(target_id && bash_c_cgi_bin_url) {
                                var bash_c_ui = new_bash_c_ui(bash_c_cgi_bin_url)
                                
                                bash_c_ui.show(target_id)
                            }
                        }
                    })
                })
    }
    
    function main(evt) {
        bash_c_bootstrap()
    }
    
    addEventListener('load', main, false)
})()
