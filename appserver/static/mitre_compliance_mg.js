/* TODO: jink to replace theme_utils with that from core */
require.config({
  paths: {
    theme_utils: '../app/mitre_heatmap/theme_utils'
  }
});

require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'theme_utils',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView, themeUtils) {

     // Row Coloring Example with custom, client-side range interpretation

    var isDarkTheme = themeUtils.getCurrentTheme && themeUtils.getCurrentTheme() === 'dark';

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
            return _(["Collection","Command And Control","Credential Access","Defense Evasion","Discovery","Execution","Exfiltration","Impact","Initial Access","Lateral Movement","Persistence","Privilege Escalation"]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value_arr = cell.value.split("|");
            technique_name = value_arr[0];
            technique_count = value_arr[1];
            search = value_arr[2];

            ttl = "Total: " + technique_count + "\nSearch: " + search;

            $td.tooltip();
            $td.prop('title', ttl);

            if (technique_count != "NULL") {
                technique_count =  parseFloat(technique_count);
                if(technique_count => 20){
                    $td.addClass('range-cell').addClass('range-compliance_high');
                }
	            if(technique_count => 10){
                    $td.addClass('range-cell').addClass('range-compliance_mid');
                }
                if(technique_count => 1){
                    $td.addClass('range-cell').addClass('range-compliance_low');
                }
                if(technique_count = 0){
                    $td.addClass('range-cell').addClass('range-compliance_zero');
                }
            }
            else if(technique_count == "NULL"){
                $td.addClass('range-cell').addClass('range-none');
            }

            if (isDarkTheme) {
              $td.addClass('dark');
            }

            // Update the cell content
            //$td.text(value.toFixed(2)).addClass('numeric');

            if (technique_name=="NULL"){
                $td.text(" ");
            }
            else {
                $td.text(technique_name);
                $td.addClass('add-border').addClass('text-align-center');
        }
        }
    });
    mvc.Components.get('mitrematrix_mg').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });
});
