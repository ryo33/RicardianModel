defmodule RicardianModel.Main do
  alias RicardianModel.Host
  alias RicardianModel.Participant
  alias RicardianModel.Actions

  @pages ["waiting", "description", "experiment", "result"]
  @states ["u1thinking", "u1proposed", "u2thinking", "u2proposed", "finished"]

  def pages, do: @pages
  def states, do: @states

  def init do
    %{
      page: "waiting",
      participants: %{},
      groups: %{},
      money: 100000..100000,
      g1rate: 1..10000,
      rounds: 2,
      g2rate: 1..100
    }
  end

  def new_participant do
    %{
      group: nil,
      joined: 1,
      money: 0,
      g1rate: 0,
      g2rate: 0
    }
  end

  def new_group(u1, u2) do
    %{
      u1: u1,
      u2: u2,
      round: 0,
      state: "u1thinking",
      g1proposal: 0,
      g2proposal: 0,
      selling: Enum.random(1..2)
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant() |> Map.put(:joined, Map.size(data.participants) + 1)
      put_in(data, [:participants, id], new)
      |> Actions.join(id, new_participant())
    else
      data
    end
  end

  def generate_country(data) do
    %{money: money_range, g1rate: g1rate_range, g2rate: g2rate_range} = data
    {Enum.random(money_range), Enum.random(g1rate_range), Enum.random(g2rate_range)}
  end

  def get_pair(group, id) do
    case group do
      %{u1: ^id, u2: target} -> target
      %{u2: ^id, u1: target} -> target
    end
  end

  def wrap(data) do
    {:ok, %{"data" => data}}
  end
end
