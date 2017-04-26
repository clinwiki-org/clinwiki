class DisplayConfigurationsController < ApplicationController
  before_action :set_display_configuration, only: [:show, :edit, :update, :destroy]

  # GET /display_configurations
  # GET /display_configurations.json
  def index
    @display_configurations = DisplayConfiguration.all
  end

  # GET /display_configurations/1
  # GET /display_configurations/1.json
  def show
  end

  # GET /display_configurations/new
  def new
    @display_configuration = DisplayConfiguration.new
  end

  # GET /display_configurations/1/edit
  def edit
  end

  # POST /display_configurations
  # POST /display_configurations.json
  def create
    @display_configuration = DisplayConfiguration.new(display_configuration_params)

    respond_to do |format|
      if @display_configuration.save
        format.html { redirect_to display_configurations_path, notice: 'Display configuration was successfully created.' }
        format.json { render :show, status: :created, location: @display_configuration }
      else
        format.html { render :new }
        format.json { render json: @display_configuration.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /display_configurations/1
  # PATCH/PUT /display_configurations/1.json
  def update
    respond_to do |format|
      if @display_configuration.update(display_configuration_params)
        format.html { redirect_to display_configurations_path, notice: 'Display configuration was successfully created.' }
        format.json { render :show, status: :ok, location: @display_configuration }
      else
        format.html { render :edit }
        format.json { render json: @display_configuration.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /display_configurations/1
  # DELETE /display_configurations/1.json
  def destroy
    @display_configuration.destroy
    respond_to do |format|
      format.html { redirect_to display_configurations_url, notice: 'Display configuration was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_display_configuration
      @display_configuration = DisplayConfiguration.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def display_configuration_params
      #params.fetch(:display_configuration, {})
      if params[:commit]
        params.require(:display_configuration).permit(:id, :render_in_section, :table_name, :column_name, :sort_order, :commit, :utf8, :authenticity_token)
      else
        params.permit(:id, :render_in_section, :table_name, :column_name, :sort_order, :utf8, :authenticity_token)
      end
    end
end
